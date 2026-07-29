from pathlib import Path
import uuid

UPLOAD_DIR = Path("uploads")

UPLOAD_DIR.mkdir(
    exist_ok=True,
    parents=True
)


def generate_filename(filename: str) -> str:

    extension = Path(filename).suffix

    return f"{uuid.uuid4()}{extension}"


def save_file(
    file_bytes: bytes,
    filename: str,
) -> Path:

    path = UPLOAD_DIR / filename

    with open(path, "wb") as f:
        f.write(file_bytes)

    return path