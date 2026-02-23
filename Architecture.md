# System Architecture

## 🏗 High-Level Architecture

Frontend (React)
        |
Backend API (Express)
        |
Business Logic Layer
        |
MongoDB Database

---

## 🔐 Authentication Flow

1. User registers with college email
2. Password hashed using bcrypt
3. JWT token generated
4. Protected routes use auth middleware

---

## 📦 Modules

### 1. Authentication Module
- Register
- Login
- JWT validation

### 2. Profile Module
- Add skills
- Add achievements
- View profiles

### 3. Hackathon Module
- List hackathons
- Filter by category
- Upcoming events

### 4. Team Module
- Send team request
- Accept / Reject request
- Team dashboard

### 5. Internship Module (Phase 2)
- Skill-based filtering
- Recommendation system