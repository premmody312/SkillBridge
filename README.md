# SkillBridge

SkillBridge is an AI-powered virtual career coach designed to provide personalized and actionable insights for users to enhance their professional journey. By leveraging advanced AI techniques and data-driven analytics, the platform aims to streamline resume optimization, identify skill gaps, and deliver tailored course recommendations, career insights, and interactive guidance.


## 🗂️ Project Structure

```bash
## 🗂️ Project Structure

```bash
repo/
├── frontend/          # Frontend code
│   └── skill_bridge/  # Next.js application
│       ├── app/       # Next.js App Router
│       │   └── (main)/
│       │       └── dashboard/
│       │           └── files/
│       │           └── analysis/
│       │           └── viewFile/
│       ├── components/ # Reusable UI components
│       │   └── ui/    # UI primitives
│       │   └── Document.tsx
│       │   └── PdfView.tsx
│       │   └── AllDocuments.tsx
│       ├── hooks/     # Custom React hooks
│       ├── lib/       # Utility functions
│       ├── public/    # Static assets
│       └── styles/    # Global styles
├── backend/          # Backend code (e.g., Python, fast.ai, mongodb etc.)
│   └── app/
│       └── routes/
│       └── services/
│       └── uploads/
│       └── database.py
│       └── app.py
│       └── requirements.txt
│       └── backendDocs.md

```

## 📦 Getting Started

### Installation

Clone the repo:

```bash
git clone https://github.com/premmody312/SkillBridge.git
cd SkillBridge

```

## 🌐 Frontend Setup
```bash
cd frontend/skill_bridge
npm install
npm run dev

```

## ⚙️ Backend Setup
```bash
cd backend/app
pip install -r requirements.txt
uvicorn app:app --reload

```

## 📚 Resouces/Information
**[📄 Detailed Backend API & Routes Documentation](backend/app/backendDocs.md)**

