# Database Schema Design

## 👤 User Schema

{
  name: String,
  email: String,
  password: String,
  college: String,
  year: Number,
  skills: [
    {
      name: String,
      level: Number
    }
  ],
  preferredRole: String,
  achievements: [String],
  github: String,
  linkedin: String,
  createdAt: Date
}

---

## 🏆 Hackathon Schema

{
  title: String,
  category: String,  // 24hr, 48hr, themed
  domain: [String],
  mode: String, // Online / Offline
  deadline: Date,
  prizePool: String,
  createdAt: Date
}

---

## 👥 Team Schema

{
  hackathonId: ObjectId,
  members: [ObjectId],
  status: String,
  createdAt: Date
}

---

## 💼 Internship Schema

{
  companyName: String,
  role: String,
  requiredSkills: [String],
  minHackathonExperience: Number,
  stipend: String,
  applyLink: String
}