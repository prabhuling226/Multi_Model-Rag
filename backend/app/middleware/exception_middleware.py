import sys
import traceback
from datetime import datetime
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.orm import Session

from app.config.database import SessionLocal
from app.models.error_log import ErrorLog
from app.core.security import decode_access_token


class ExceptionLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            return await call_next(request)
        except Exception as exc:
            # Extract user_id from Authorization Bearer token if present
            user_id = None
            auth_header = request.headers.get("authorization") or request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
                payload = decode_access_token(token)
                if payload and "sub" in payload:
                    try:
                        user_id = int(payload["sub"])
                    except (ValueError, TypeError):
                        user_id = None

            # Capture exception details
            endpoint = str(request.url.path)
            method = request.method
            error_message = str(exc) or exc.__class__.__name__
            stack_trace = "".join(traceback.format_exception(*sys.exc_info()))

            # Save error log to database
            db: Session = SessionLocal()
            try:
                error_log = ErrorLog(
                    endpoint=endpoint[:255],
                    method=method[:20],
                    error_message=error_message,
                    stack_trace=stack_trace,
                    user_id=user_id,
                    timestamp=datetime.utcnow(),
                )
                db.add(error_log)
                db.commit()
            except Exception as db_exc:
                db.rollback()
                print(f"[Middleware Error Log Failed]: {db_exc}")
            finally:
                db.close()

            return JSONResponse(
                status_code=500,
                content={
                    "detail": "An internal server error occurred.",
                    "error_code": "INTERNAL_SERVER_ERROR",
                    "message": error_message,
                },
            )
