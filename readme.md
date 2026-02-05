```md
# 🤖 AI Chat Backend (RAG + General Chat)

This project is a **Node.js backend** that powers an AI chatbot with two main abilities:

1. 💬 **General AI Chat** – answers normal questions like ChatGPT  
2. 📄 **Document-based Chat (RAG)** – answers questions only from uploaded PDF files

The backend is designed in a clean and scalable way so that PDFs are processed once, and chat remains fast.

---

## 🧠 What Problem This Backend Solves (Non-Technical)

- Users can upload a PDF (company document, policy, notes, etc.)
- The system **reads and understands the PDF**
- Users can ask questions and get answers **only from that PDF**
- Users can also switch back to normal AI chat anytime
- The system can search the internet if live information is needed

---

## 🧩 How It Works (Simple Technical Explanation)

The backend works in **two stages**:

---

## 📌 Stage 1: Document Indexing (One-Time Process)

When a PDF is uploaded:

1. 📄 The PDF file is loaded
2. ✂️ The text is split into small chunks
3. 🔢 Each chunk is converted into a numeric vector (embedding)
4. 🗄️ These vectors are stored in **Pinecone (vector database)**

This step happens **only once per PDF**.

> After this, the backend does NOT need to read the PDF again.

---

## 📌 Stage 2: Chatting with AI

### 🔹 RAG Chat (PDF-based)

1. User asks a question
2. The question is converted into a vector
3. Similar vectors are fetched from Pinecone
4. The related PDF content is sent to the AI model
5. The AI answers **only using the PDF content**

If the answer is not found in the document, the AI clearly says so.

---

### 🔹 General AI Chat

1. User asks a normal question
2. The AI answers directly
3. If real-time data is required, the backend automatically performs a web search
4. The AI uses that result to respond

---

## ⚙️ Technologies Used

### Core
- **Node.js**
- **Express.js**

### AI & Search
- **Groq LLM** (`llama-3.3-70b-versatile`)
- **Pinecone** (Vector Database)
- **Hugging Face Local Embeddings** (`Xenova/all-MiniLM-L6-v2`)
- **LangChain** (PDF loading & text splitting)
- **Tavily API** (Web search)

### Utilities
- **Multer** (PDF upload)
- **Node Cache** (temporary memory)

---

## 📂 Backend Responsibilities

| Feature | Description |
|------|------------|
PDF Upload | Accepts PDF files |
PDF Processing | Reads & splits document |
Vector Storage | Stores embeddings in Pinecone |
RAG Chat | Answers from PDF only |
General Chat | Normal AI chat |
Web Search | Real-time information lookup |

---

## 🛣️ API Endpoints

### 🔹 Upload & Index PDF

```

POST /api/rag/upload

```

**Purpose:**
- Uploads a PDF
- Indexes it into the vector database

**Runs only once per document**

---

### 🔹 RAG Chat (Document-based)

```

POST /api/rag/chat

```

**Purpose:**
- Answers questions using uploaded PDF content only

---

### 🔹 General AI Chat

```

POST /api/chat/general

````

**Purpose:**
- Handles normal AI chat
- Uses web search if needed

---

## 🧠 Memory & Storage Design

- PDFs are **not permanently stored**
- Files are processed in memory for speed
- Only vector embeddings are stored
- Chat history is cached temporarily

This keeps the backend:
- Fast
- Clean
- Cost-effective

---

## 🔐 Environment Variables

Create a `.env` file:

```env
PORT=5000
GROQ_API_KEY=your_groq_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=your_index_name
TAVILY_API_KEY=your_tavily_api_key
````

---

## ▶️ How to Run the Backend

```bash
npm install
npm run dev
```

Server will start at:

```
http://localhost:5000
```

---

## ✅ Key Design Decisions

* PDF indexing is separated from chat
* Fast retrieval using vector search
* Local embeddings to avoid paid APIs
* Clear separation between RAG and normal chat
* Scalable and production-ready architecture

---

## 🎯 Summary

This backend provides:

* Smart document understanding
* Accurate PDF-based answers
* General AI chat with live web data
* Clean, modular, and scalable design

It can be used as the core AI engine for:

* Knowledge-base chatbots
* Company document assistants
* Learning platforms
* AI-powered support systems

---

