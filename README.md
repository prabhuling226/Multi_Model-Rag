<div align="center">

# 🚀 Multi-Modal RAG Platform

### Enterprise AI Document Intelligence System powered by FastAPI, React & Google Gemini

Transform PDFs, Images, Word, Excel, and PowerPoint files into an intelligent AI knowledge base.

![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Framework-green?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql)
![Gemini](https://img.shields.io/badge/Google-Gemini-orange?style=for-the-badge&logo=google)

</div>

---

# 📖 Overview

**Multi-Modal RAG** is an enterprise-grade AI application that enables users to upload documents and interact with them through natural language conversations.

Instead of relying solely on an LLM's pre-trained knowledge, the application retrieves relevant information directly from uploaded documents, significantly improving response accuracy while minimizing hallucinations.

The system supports multiple document formats, extracts structured and unstructured information, generates semantic embeddings, retrieves the most relevant context, and produces AI-powered answers using **Google Gemini**.

---

# ✨ Features

### 🔐 Authentication

- Secure JWT Authentication
- User Registration & Login
- Protected API Routes

### 📂 Document Management

- Upload Multiple Files
- PDF Processing
- Word Documents
- Excel Sheets
- PowerPoint Presentations
- Image Understanding

### 🤖 AI Capabilities

- Retrieval Augmented Generation (RAG)
- Semantic Search
- Intelligent Chunking
- Google Gemini Integration
- Gemini Vision Support

### 💬 Chat

- Document Specific Conversations
- Persistent Chat History
- Context Aware Responses

### 📊 Dashboard

- Upload Statistics
- Chat Statistics
- Profile Management
- Document Analytics

---

# 🏛️ Architecture

```
                        React Frontend
                              │
                              ▼
                      FastAPI REST APIs
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
 Authentication         Upload Service      Chat Service
         │                    │                    │
         ▼                    ▼                    ▼
     PostgreSQL        Document Processing    Retriever
                              │
                              ▼
             PDF │ Word │ Excel │ PPT │ Images
                              │
                              ▼
                  Text + OCR + Tables + Images
                              │
                              ▼
                       Chunking Pipeline
                              │
                              ▼
                    Embedding Generation
                              │
                              ▼
                        Semantic Search
                              │
                              ▼
                      Prompt Construction
                              │
                              ▼
                         Google Gemini
                              │
                              ▼
                     AI Generated Response
```

---

# ⚙️ Complete Processing Pipeline

## 1️⃣ Authentication

The user creates an account or logs into the application.

A JWT Access Token is generated and securely attached to every protected API request.

↓

## 2️⃣ Upload Documents

Users can upload:

- 📄 PDF
- 📘 Word
- 📊 Excel
- 📽 PowerPoint
- 🖼 Images

↓

## 3️⃣ Document Processing

Each file type is processed independently.

### PDF

- Text Extraction
- OCR
- Table Detection
- Image Extraction

### Images

- Gemini Vision Analysis

### Word

- Paragraph Extraction

### Excel

- Worksheet Parsing

### PowerPoint

- Slide Text Extraction

↓

## 4️⃣ Intelligent Chunking

Large documents are divided into meaningful semantic chunks.

This enables:

- Faster Retrieval
- Better Context
- Reduced Token Usage

↓

## 5️⃣ Embedding Generation

Each chunk is converted into vector embeddings representing its semantic meaning.

↓

## 6️⃣ Storage

The application stores:

- User Information
- Documents
- Chunks
- Chat History
- Embeddings Metadata

↓

## 7️⃣ User Query

Example:

> Summarize the annual financial report.

↓

## 8️⃣ Semantic Retrieval

The Retriever searches for the most relevant chunks using semantic similarity rather than keyword matching.

↓

## 9️⃣ Prompt Construction

```
Context:
<Relevant Chunks>

Question:
<User Question>

Instructions:
Answer only using the provided context.
```

↓

## 🔟 Gemini Response

Google Gemini generates an accurate, context-aware answer based only on the retrieved information.

↓

## 1️⃣1️⃣ Store Conversation

The complete conversation is stored for future reference.

---

# 📂 Project Structure

```
Multi_Model_RAG
│
├── backend
│   ├── app
│   │   ├── api
│   │   ├── config
│   │   ├── core
│   │   ├── models
│   │   ├── processors
│   │   ├── rag
│   │   ├── repository
│   │   ├── routers
│   │   ├── schemas
│   │   ├── services
│   │   └── utils
│   │
│   ├── alembic
│   └── uploads
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── routes
│   │   └── context
│   │
│   └── public
│
└── README.md
```

---

# 🛠 Tech Stack

| Category | Technologies |
|-----------|--------------|
| Backend | FastAPI, SQLAlchemy, PostgreSQL |
| Frontend | React, Vite, Tailwind CSS |
| AI | Google Gemini, Gemini Vision |
| Authentication | JWT |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Migration | Alembic |
| API Testing | Postman |

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/prabhuling226/Multi_Model-Rag.git

cd Multi_Model-Rag
```

---

## Backend

```bash
cd backend

python -m venv venv
```

Activate environment

### Windows

```bash
venv\Scripts\activate
```

### Linux

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Create `.env`

```env
DATABASE_URL=
SECRET_KEY=
ALGORITHM=
GEMINI_API_KEY=
```

Run migrations

```bash
alembic upgrade head
```

Start FastAPI

```bash
uvicorn app.main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 📡 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/register` | Register User |
| POST | `/auth/login` | Login |
| POST | `/documents/upload` | Upload Documents |
| GET | `/documents` | List Documents |
| DELETE | `/documents/{id}` | Delete Document |
| POST | `/chat` | Ask Questions |
| GET | `/dashboard` | Dashboard Statistics |
| GET | `/profile` | User Profile |

---

# 🔮 Future Improvements

- 🌍 Global Chat Across Documents
- ⚡ Streaming Responses
- 🧠 Conversation Memory
- 📁 Folder Based Document Organization
- 🔍 Hybrid Search
- 📦 Docker Support
- ☁️ Cloud Deployment
- 📊 Vector Database Integration (FAISS / Pinecone)
- 👥 Team Collaboration

---

# 👨‍💻 Author

### Prabhuling Minajagi

Backend Developer • AI/ML Enthusiast • FastAPI • React • RAG Systems

If you found this project interesting, feel free to ⭐ the repository.
