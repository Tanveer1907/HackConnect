# API Documentation

## 🔐 Authentication

### POST /api/auth/register
Body:
{
  name,
  email,
  password,
  college
}

### POST /api/auth/login
Body:
{
  email,
  password
}

---

## 👤 Profile

### GET /api/profile/:id
Protected Route

### PUT /api/profile/update
Protected Route

---

## 🏆 Hackathons

### GET /api/hackathons
Returns all hackathons

### GET /api/hackathons?category=24hr
Filter by category

---

## 👥 Team

### POST /api/team/request
Send team request

### PUT /api/team/accept
Accept team request