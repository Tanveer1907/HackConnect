# 🚀 HackConnect: The Ultimate Hackathon Collaboration Network

## 📌 Project Overview
HackConnect is India's first verified hackathon collaboration platform designed for college students. The platform solves the persistent problem of finding reliable teammates and discovering relevant hackathons, all while translating these experiences into actionable internship opportunities.

## 🎯 The Problem & Our Solution
**The Problem:** Students often struggle to find dedicated hackathon teammates outside their immediate college circles. Discovering relevant hackathons and converting those experiences into tangible career opportunities (internships) is a disjointed process.

**The Solution:** HackConnect offers a verified platform where students can authenticate with their college email, showcase their skills and past achievements, dynamically form teams based on a proprietary intelligent matching system, and discover hackathons—all in one place.

## 🔥 Core Features
- **Verified Authentication:** Secure registration using official college email IDs with robust JWT authorization.
- **Intelligent Team Formation:** An advanced recommendation system matches students based on skills, preferred roles, past hackathon experience, and complementary skill logic (e.g., matching a frontend dev with a backend dev).
- **Real-Time Communication:** Integrated 1-on-1 and Group messaging using WebSocket (`socket.io`), allowing seamless communication for prospective and existing teams.
- **Hackathon Discovery:** A categorized, easily filterable dashboard for upcoming hackathons.
- **Internship Recommendations:** A phase 2 feature leveraging student profiles and hackathon performance to recommend internships.
- **Global Route Protection:** Secure application wrapper that completely restricts unauthenticated users from accessing internal dashboards.

## 🛠 Tech Stack
**Frontend:**
- React.js
- Tailwind CSS
- Socket.io-client
- React Router (with Protected Routes)

**Backend:**
- Node.js & Express.js
- MongoDB (Mongoose ORM)
- Socket.io (WebSocket for real-time chat)
- JWT Authentication & bcrypt (Security)

**Deployment Targets:**
- Frontend: Vercel
- Backend: Render / AWS

## 📂 Project Structure
```text
HackConnect/
├── backend/            # Express REST API & Socket server
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/     # Mongoose Schemas (User, Team, Message, etc.)
│   │   ├── routes/
│   │   └── middleware/ # Auth validation
│   └── server.js       # Main server & Socket.io initialization
└── frontend/           # React App
    ├── src/
    │   ├── components/ # Reusable UI components (Navbar, Cards, etc.)
    │   ├── pages/      # Route pages (Home, Dashboard, Chat, Teams, etc.)
    │   ├── services/   # Axios API calls (api.js)
    │   └── App.js      # Main routing and ProtectedRoute logic
```

## ▶️ Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB connection string (Local or Atlas)

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file with your PORT, MONGO_URI, and JWT_SECRET
npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 👨‍💻 Team Members
- **Tanveer** – Backend Lead
- **Ruhani** – Frontend & Integration