# Project Documentation - Multimodal AI Document RAG System

Welcome to the **Multimodal AI Document RAG (Retrieval-Augmented Generation)** System documentation. This application is a production-ready, full-stack knowledge retrieval and Q&A engine built with **FastAPI** on the backend, **React (Vite)** on the frontend, **PostgreSQL** as the primary vector database, and **Google Gemini AI** for multimodal chunk processing, embeddings (`text-embedding-004`), and contextual answer generation (`gemini-2.0-flash`).

---

## 📐 1. Architecture Overview

```
                      +----------------------------------+
                      |         React Frontend           |
                      |   (Vite + Tailwind Off-White UI) |
                      +----------------------------------+
                                       |
                                HTTP / REST API
                                       v
                      +----------------------------------+
                      |          FastAPI Backend         |
                      |   (Middleware + JWT Security)    |
                      +----------------------------------+
                                       |
         +-----------------------------+-----------------------------+
         |                             |                             |
         v                             v                             v
+------------------+         +------------------+         +------------------+
|  PostgreSQL DB   |         | Document Process |         |  Google Gemini   |
| (Users, Docs,    |         | (PDF, DOCX, XLSX,|         | (embeddings-004, |
| Chunks, Errors)  |         |  PPTX, TXT, OCR) |         | gemini-2.0-flash)|
+------------------+         +------------------+         +------------------+
```

---

## 🔄 2. Complete Data Flow

### A. Authentication Flow
1. **Registration (`POST /api/v1/auth/register`)**:
   - Accepts `full_name`, `email`, and `password`.
   - Validates uniqueness of email.
   - Hashes password securely using **bcrypt**.
   - Stores user in `users` PostgreSQL table.
2. **Login (`POST /api/v1/auth/login`)**:
   - Accepts form data (`username` = email, `password`).
   - Verifies password hash against database record.
   - Generates JWT Access Token with `sub` payload set to `user.id`.
   - Returns Bearer Token stored in `localStorage` by frontend.

### B. Document Ingestion Flow (`POST /api/v1/documents/upload`)
1. **Upload Request**:
   - Authenticated user sends single or multiple document files via multipart/form-data.
2. **File Storage & Processing**:
   - File saved locally into `uploads/` directory with a unique UUID filename prefix.
   - Document metadata stored in `documents` table.
   - `ProcessorFactory` inspects file extension (`.pdf`, `.docx`, `.xlsx`, `.pptx`, `.txt`, `.md`, `.png`, `.jpg`).
   - Appropriate processor extracts text, tables, and images. Image components are passed to `GeminiVision` for OCR & visual semantic descriptions.
3. **Chunking & Vector Embeddings**:
   - `ChunkManager` breaks content into overlapping text chunks (Size = 500 characters, Overlap = 100 characters).
   - `EmbeddingService` sends each chunk text to Google Gemini `text-embedding-004` to generate dense 768-dimensional float embeddings.
   - Each chunk, its page number, metadata, and embedding array are stored in the `chunks` PostgreSQL table linked to the `document_id`.

### C. Conversational RAG Query Flow (`POST /api/v1/chat/`)
1. **Query Input**:
   - User submits a question along with an optional `document_id`.
   - If `document_id` is provided: Search is scoped strictly to chunks of that document.
   - If `document_id` is `null`: Global search searches across all document chunks owned by the authenticated user.
2. **Vector Similarity Retrieval**:
   - Query text converted to embedding vector using Gemini `text-embedding-004`.
   - Cosine similarity calculated between query vector and database chunk embeddings.
   - Top K (default = 5) most relevant chunks retrieved.
3. **Context-Augmented LLM Response**:
   - Context string built from retrieved chunks with page citations.
   - Gemini `gemini-2.0-flash` receives system instructions enforcing context-only answers with structured Markdown formatting.
   - Question and generated answer saved to `chats` table for user conversation history.
   - JSON response returned containing `answer` and `sources` array (document name, page number, snippet).

### D. Custom Exception Middleware Flow
1. **Intercepting Exceptions**:
   - `ExceptionLoggingMiddleware` wraps all incoming HTTP requests.
   - When an unhandled exception occurs anywhere in the stack, the middleware catches it before crashing the server.
2. **Error Logging**:
   - Middleware inspects Authorization header; if valid JWT token is present, extracts authenticated `user_id`.
   - Captures request endpoint, HTTP method, timestamp, error message, and full stack trace string.
   - Persists error entry into `error_logs` PostgreSQL table.
3. **Uniform Error JSON**:
   - Returns a structured 500 JSON response: `{ "detail": "An internal server error occurred.", "error_code": "INTERNAL_SERVER_ERROR", "message": "..." }`.

---

## 🗄️ 3. Database Schema & Indexing Rationale

Primary Database: **PostgreSQL**

### 1. `users` Table
- `id` (INTEGER, Primary Key, Indexed)
- `full_name` (VARCHAR(100))
- `email` (VARCHAR(255), Unique, Indexed)
- `password` (VARCHAR(255))
- `is_active` (BOOLEAN, default True)
- `created_at` (TIMESTAMP)
- **Index Rationale**: Index on `email` provides fast lookup during login authentication.

### 2. `documents` Table
- `id` (INTEGER, Primary Key, Indexed)
- `filename` (VARCHAR(255))
- `file_type` (VARCHAR(50))
- `file_path` (VARCHAR(500))
- `uploaded_at` (TIMESTAMP)
- `owner_id` (INTEGER, Foreign Key -> `users.id`, Indexed)
- **Index Rationale**: Index on `owner_id` enables fast retrieval of all documents belonging to a specific user.

### 3. `chunks` Table
- `id` (INTEGER, Primary Key, Indexed)
- `content_type` (VARCHAR(30))
- `page_number` (INTEGER, Nullable)
- `section` (VARCHAR(255), Nullable)
- `chunk_text` (TEXT)
- `chunk_metadata` (JSON, Nullable)
- `embedding` (JSON / ARRAY float)
- `document_id` (INTEGER, Foreign Key -> `documents.id`, Indexed)
- **Index Rationale**: Index on `document_id` speeds up vector retrieval when filtering by document.

### 4. `chats` Table
- `id` (INTEGER, Primary Key, Indexed)
- `question` (TEXT)
- `answer` (TEXT)
- `user_id` (INTEGER, Foreign Key -> `users.id`, Indexed)
- `document_id` (INTEGER, Foreign Key -> `documents.id`, Nullable, Indexed)
- `created_at` (TIMESTAMP)

### 5. `error_logs` Table (Assignment Requirement)
- `id` (INTEGER, Primary Key, Indexed)
- `endpoint` (VARCHAR(255))
- `method` (VARCHAR(20))
- `error_message` (TEXT)
- `stack_trace` (TEXT)
- `user_id` (INTEGER, Nullable, Indexed)
- `timestamp` (TIMESTAMP, Indexed)
- **Index Rationale**: Indexes on `timestamp` and `user_id` allow rapid diagnostic querying and error auditing.

---

## 🌐 4. Complete API Endpoints Catalog

### Base URL: `/api/v1`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/auth/register` | No | Register a new user account with hashed password |
| `POST` | `/auth/login` | No | Authenticate user credentials and issue JWT token |
| `POST` | `/documents/upload` | Yes | Upload and ingest documents, generate embeddings |
| `GET` | `/documents/` | Yes | List all uploaded documents for the current user |
| `DELETE` | `/documents/{id}` | Yes | Delete document and associated chunk embeddings |
| `POST` | `/chat/` | Yes | Submit RAG question (document-specific or global) |
| `GET` | `/chat/history` | Yes | Fetch user conversation history |
| `GET` | `/dashboard/stats` | Yes | Get user analytics stats (document count, chat count, etc.) |
| `GET` | `/profile/` | Yes | Get user profile details |
| `PUT` | `/profile/` | Yes | Update full name or email |
| `PUT` | `/profile/change-password` | Yes | Change user password |
| `GET` | `/health` | No | System health check endpoint |

---

## 🔑 5. API Keys Guide: What You Need, Where to Put Them & Where to Get Them

To run the application locally or deploy it to production on **Render** (Backend) and **Vercel** (Frontend), you need the following environment variables / API keys:

### Summary Table

| Variable Name | Purpose | Where to Get / How to Generate | Where to Put It |
|---|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Create a free database at [Neon.tech](https://neon.tech) or Supabase. Example: `postgresql://user:pass@ep-xyz.neon.tech/dbname?sslmode=require` | Place in `backend/.env` and Render Environment Variables |
| `GOOGLE_API_KEY` | Gemini AI key for embeddings & LLM answers | Get a free API key from [Google AI Studio](https://aistudio.google.com/) | Place in `backend/.env` and Render Environment Variables |
| `SECRET_KEY` | JWT signing secret string | Generate any random secure string (e.g. run `openssl rand -hex 32` or type any 32+ character random string) | Place in `backend/.env` and Render Environment Variables |
| `ALGORITHM` | JWT signing algorithm | Set to `HS256` | Place in `backend/.env` and Render Environment Variables |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration duration | Set to `1440` (24 hours) | Place in `backend/.env` and Render Environment Variables |
| `VITE_API_URL` (Frontend) | URL of running FastAPI backend | For local dev: `http://localhost:8000/api/v1`<br>For Render deployment: `https://your-backend.onrender.com/api/v1` | Place in `frontend/.env` and Vercel Environment Variables |

---

## 🚀 6. Step-by-Step Deployment Instructions

### A. Deploy Backend to Render (Render.com)

1. Sign up / Log in to [Render.com](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository containing this codebase.
4. Set the root directory to `backend`.
5. Select **Python 3** environment.
6. Build Command: `pip install -r requirements.txt`
7. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
8. Under **Environment Variables**, add:
   - `DATABASE_URL` = `your_neon_postgresql_url`
   - `GOOGLE_API_KEY` = `your_gemini_api_key`
   - `SECRET_KEY` = `your_random_secret_key`
   - `ALGORITHM` = `HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES` = `1440`
   - `API_V1_STR` = `/api/v1`
   - `PROJECT_NAME` = `AI Document Chat RAG API`
9. Click **Deploy Web Service**. Once deployed, copy your backend URL (e.g., `https://multi-model-rag-backend.onrender.com`).

---

### B. Deploy Frontend to Vercel (Vercel.com)

1. Sign up / Log in to [Vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Set **Root Directory** to `frontend`.
5. Framework Preset: **Vite**.
6. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api/v1` (replace with your Render backend URL).
7. Click **Deploy**. Vercel will build the frontend using `vercel.json` rewrite routing automatically!

---

## 🛠️ 7. Local Setup Instructions

### Running Backend Locally:
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Create .env file inside backend/ directory with:
# DATABASE_URL=postgresql://user:password@localhost:5432/rag_db
# GOOGLE_API_KEY=your_gemini_api_key
# SECRET_KEY=supersecretkey123
# ALGORITHM=HS256
# ACCESS_TOKEN_EXPIRE_MINUTES=1440
# API_V1_STR=/api/v1
# PROJECT_NAME=AI Document Chat RAG API

uvicorn app.main:app --reload --port 8000
```

### Running Frontend Locally:
```bash
cd frontend
npm install

# Create .env file inside frontend/ directory with:
# VITE_API_URL=http://localhost:8000/api/v1

npm run dev
```

Open `http://localhost:5173` in your browser to access the application!
