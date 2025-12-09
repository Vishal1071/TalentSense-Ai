# TalentSense AI

TalentSense AI is a full-stack MERN + AI platform that analyzes resumes, matches them to job descriptions, and provides AI-powered mock interviews.  
This repo is a **monorepo** containing both frontend (React + Vite) and backend (Node + Express + MongoDB).

---

## 🚀 Project Overview

**Goal:**  
A complete hiring-assistant platform that handles:
- Resume upload & parsing  
- AI resume scoring  
- Job-description matching  
- AI mock interviews  
- User dashboard  
- Admin analytics  

**Tech Stack:**
- **Frontend:** React (Vite), TailwindCSS, Axios, React Router  
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), Multer  
- **AI:** OpenAI API (GPT)  
- **Storage:** Cloudinary for file uploads  
- **Auth:** JWT  
- **Tools:** GitHub Actions, Postman, Docker (optional)

---

## 📁 Folder Structure

```
talentsense-ai/
  frontend/        # React application
  backend/         # Express + MongoDB backend
  README.md        # Project documentation
  .gitignore       # Ignore rules for whole repo
```

---

## ⚙️ Backend Setup (Express + MongoDB)

### 1. Install dependencies
```
cd backend
npm install
```

### 2. Create `.env` inside `/backend`
```
PORT=5000
MONGO_URI=your_mongo_uri_here
JWT_SECRET=your_jwt_secret
OPENAI_KEY=your_openai_key
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
```

### 3. Start backend
```
npm run dev
```

Backend runs on:  
**http://localhost:5000**

---

## 🎨 Frontend Setup (React + Vite)

### 1. Install dependencies
```
cd frontend
npm install
```

### 2. Environment file (optional but recommended)
Create `frontend/.env`:
```
VITE_API_URL="http://localhost:5000"
```

### 3. Start frontend
```
npm run dev
```

Frontend runs on:  
**http://localhost:5173**

---

## 🔗 Core API Endpoints

### Auth
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Resume & AI
```
POST /api/resume/upload
POST /api/ai/analyze-resume
POST /api/ai/match-jd
POST /api/ai/mock-interview
```

### Admin
```
GET /api/admin/reports
```

---

## 🧠 AI Features

### 1. Resume Analyzer  
- Extracts text from PDF/DOCX  
- Scores resume (0–100)  
- Highlights missing skills  
- Suggests improvements  

### 2. JD Matching  
- Compares resume to job description  
- Returns match % and missing skills  
