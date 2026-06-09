<div align="center">

# 🌿 AgriMit — Crop Intelligence Platform

**AI-powered crop disease detection and recovery planning for modern farmers.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.136-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://tensorflow.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

</div>

---

## 🚀 What is AgriMit?

AgriMit is an end-to-end **AI crop disease diagnosis platform** that allows farmers to upload a photo of a leaf and receive:

- ✅ Instant disease identification (18 crop/disease classes)
- ✅ Confidence score and severity rating
- ✅ AI-generated recovery plan powered by **Llama 3.3** via Groq API
- ✅ Secure user accounts via Firebase Authentication

> Supported crops: **Apple**, **Grape**, **Tomato**

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│          (Vite + TailwindCSS + Firebase Auth)           │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP (via Vite proxy)
┌──────────────────────▼──────────────────────────────────┐
│              FastAPI ML Microservice                     │
│        (TensorFlow · OpenCV · Groq API)                 │
│                   Port 8000                             │
│                                                          │
│   ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │
│   │  Validators │  │  ML Model    │  │  Recommender │  │
│   │ (blur/expo) │  │ MobileNetV2  │  │  Groq LLM    │  │
│   └─────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
AgriMit/
├── backend/                    # 🐍 Python FastAPI ML Service
│   ├── models/
│   │   ├── best_agrivision_model.keras   # Trained MobileNetV2 (18 classes)
│   │   └── class_names.json              # Disease class labels
│   ├── main.py                 # FastAPI server & inference pipeline
│   ├── validators.py           # Blur & exposure detection
│   ├── recommender.py          # Groq API recovery plan generator
│   └── requirements.txt
│
├── express-backend/            # 🟢 Node.js Express (History & Gateway)
│   ├── models/
│   │   ├── User.js             # MongoDB user schema
│   │   └── Prediction.js       # Scan history schema
│   ├── routes/
│   │   ├── auth.js             # JWT authentication routes
│   │   └── predict.js          # ML proxy + DB save routes
│   └── server.js
│
└── frontend/                   # ⚛️ React Application
    ├── src/
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── AnalyzePage.jsx
    │   │   └── HistoryPage.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  # Firebase auth state
    │   └── firebase.js          # Firebase initialization
    └── vite.config.js
```

---

## ⚙️ Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Python | **3.10 – 3.12** (TensorFlow requirement) |
| Node.js | 18+ |
| Git | Any |

> ⚠️ **Python 3.13+ / 3.14 is NOT supported** because TensorFlow does not yet have a compatible wheel.

---

### 1. Clone the Repository

```bash
git clone https://github.com/saurabhkun/AgriMit.git
cd AgriMit
```

---

### 2. Run the ML Backend (FastAPI · Port 8000)

```bash
cd backend

# Create virtual environment with Python 3.11
py -3.11 -m venv venv

# Activate it (Windows)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set your Groq API key (optional — falls back to rule-based plan)
set GROQ_API_KEY=your_groq_key_here

# Start the server
python main.py
```

The ML service will be live at **http://localhost:8000**

Verify with: `curl http://localhost:8000/health`

---

### 3. Run the Frontend (React · Port 5173)

```bash
cd frontend

# Install dependencies
npm install

# Create your environment file
copy .env.example .env
# Fill in your Firebase credentials in .env

# Start the dev server
npm run dev
```

Frontend will be live at **http://localhost:5173**

---

## 🔑 Environment Variables

### `frontend/.env`
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### `backend/.env` (optional)
```env
GROQ_API_KEY=your_groq_api_key
```
> Without `GROQ_API_KEY`, the recommender falls back to a built-in rule-based recovery plan.

---

## 🤖 ML Model Details

| Property | Value |
|---|---|
| Base Architecture | MobileNetV2 |
| Input Size | 160 × 160 × 3 |
| Total Classes | 18 |
| Confidence Gate | 60% minimum |
| Blur Detection | Laplacian variance < 30 |

### Supported Classes

| Crop | Diseases |
|------|---------|
| 🍎 Apple | Apple Scab, Black Rot, Cedar Apple Rust, Healthy |
| 🍇 Grape | Black Rot, Esca (Black Measles), Leaf Blight, Healthy |
| 🍅 Tomato | Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Spider Mites, Target Spot, Yellow Leaf Curl Virus, Mosaic Virus, Healthy |

---

## 🛡️ API Reference

### FastAPI — Port 8000

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/health` | Model status check |
| `POST` | `/v1/analyze` | Upload image → get disease prediction + recovery plan |

### Request Format (`/v1/analyze`)

```
Content-Type: multipart/form-data
Field: file (JPEG / PNG image)
Query: lang (optional, default: "English")
```

### Response Example

```json
{
  "status": "success",
  "prediction": {
    "crop": "Tomato",
    "disease": "Early blight",
    "confidence": 0.9241,
    "severity": "High"
  },
  "recovery_plan": "1. Remove infected leaves...",
  "metadata": {
    "model": "best_agrivision_model.keras",
    "classes": 18
  }
}
```

---

## 🗺️ Roadmap

- [x] Firebase Authentication (Login / Register / Logout)
- [x] ML inference pipeline (MobileNetV2, 18 classes)
- [x] Image quality validation (blur + exposure)
- [x] AI recovery plan generation (Groq + Llama 3.3)
- [x] Protected routes
- [ ] History page connected to backend
- [ ] Prediction history saved per user
- [ ] Multilingual recovery plans
- [ ] Mobile responsive improvements

---

## 👨‍💻 Author

**Saurabh** — [@saurabhkun](https://github.com/saurabhkun)

---

<div align="center">

Made with 🌱 for smarter farming.

</div>
