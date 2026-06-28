# HackConnect — Deep Project Analysis & Implementation Plan

> Generated: 2026-06-28 — a full review of the backend, frontend, and documentation, covering improvements, inconsistencies, issues, the system workflow, what remains, and a phased implementation plan.

---

## 1. Project Snapshot

- **Product:** HackConnect — a hackathon collaboration platform for college students: verified signup, skill-based teammate matching, hackathon discovery, real-time chat, and an admin portal for managing hackathons.
- **Backend:** Node.js (CommonJS) + Express 5, Mongoose 9 (MongoDB Atlas) for core data, Prisma 7 + PostgreSQL (Neon) **only** for the Admin model, Socket.IO 4 for chat, Passport (Google + GitHub OAuth), Cloudinary + Multer uploads, Nodemailer OTP, EJS admin views.
- **Frontend:** React 19 + React Router 7 (Create React App), Axios, Socket.IO client, Tailwind (utility classes), React Hot Toast, React Icons. Context API for theme only.
- **Maturity:** ~70% of the stated MVP. Core flows work; production-hardening, tests, CI/CD, and Phase-2 features are missing.

---

## 2. Workflow (How the System Actually Works)

**User journey:** Landing (`/`) → Login/Register (email+password or Google/GitHub OAuth) → JWT stored in `localStorage` → `ProtectedRoute` gates `/dashboard`, `/hackathons`, `/hackathon/:id`, `/teams`, `/profile`, `/edit-profile`, `/chat`.

**Auth flow:** OAuth callback redirects to the frontend with `?token=` in the URL (Safari ITP fallback) which the client extracts and stores. API calls attach `Authorization: Bearer <token>` via an Axios request interceptor.

**Team flow:** User opens a hackathon → creates a team or sends a join request → request creates a chat message to the leader → leader accepts (moves user from `pendingRequests` to `members`).

**Chat flow:** Socket.IO. Client emits `authenticate {userId}` (joins a personal room), `join_room {roomId}`, `send_message {roomId, sender, text}`. Server persists to Mongo `Message`, populates sender, and re-broadcasts `receive_message` to the room + both personal rooms. Room id = `[idA, idB].sort().join('-')`. A 5s poll also refreshes the chat list.

**Admin flow:** Admin login (email + master password) → OTP emailed (or returned as `devOtp` on trial hosts) → OTP verify returns JWT set as an `admin_token` httpOnly cookie (with a `?token=` query fallback) → EJS dashboard at `/dashboard`, `/users`, `/hackathons`, `/upload`; create/delete hackathons with Cloudinary images.

---

## 3. Architecture Map

```
Frontend (CRA, :3000)  --REST/Axios-->  Backend (Express, :5001)
        |                                   |-- Mongoose --> MongoDB Atlas (User, Hackathon, Team, Message)
        |                                   |-- Prisma  --> PostgreSQL/Neon (Admin only)
        |                                   |-- Passport --> Google / GitHub OAuth
        |                                   |-- Cloudinary/Multer (images)
        |                                   |-- Nodemailer (OTP email)
        '-------Socket.IO (chat)------------'
```

**Backend layout** (`backend/src`): `controllers/` (auth, chat, hackathon, team, user), `middleware/` (authMiddleware, adminAuth, errorHandler), `models/` (User, Hackathon, Team, Message — Mongoose), `routes/` (auth, user, hackathon, team, chat, admin), `app.js`. Plus `config/` (db.js, passport.js), `views/` (EJS admin pages), `prisma/schema.prisma` (Admin only), `seed.js`, `testFetch.js`, `testQuery.js`.

**Frontend layout** (`frontend/src`): `components/` (HackathonCard, TeamCard, Navbar, Sidebar, ProtectedRoute, PublicRoute), `context/` (ThemeContext), `pages/` (Home, Login, Register, Signup, Dashboard, Hackathons, Teams, HackathonDetails, Profile, EditProfile, Chat), `services/api.js`, `App.js`.

---

## 4. Issues & Inconsistencies (Prioritized)

### 4.1 CRITICAL — Security
1. **Live secrets in `backend/.env`** (MongoDB URI, `JWT_SECRET=hackconnect_secret`, Google/GitHub OAuth client+secret, Neon Postgres URL, Cloudinary secret, Gmail app password). `.env` is gitignored now, but the values are real and must be **rotated immediately**. Verify they were never committed (`git log --all -- backend/.env`); if so, purge from history.
2. **Weak JWT secret** (`hackconnect_secret`) — predictable; must become a long random value.
3. **Hardcoded OAuth callback URLs** in `config/passport.js` (`http://localhost:5000/...`) — break in production and don't use env vars.
4. **Socket.IO CORS `origin: "*"`** in `server.js` — any site can open a socket. Restrict to `FRONTEND_URL`.
5. **`GET /api/chat/:roomId` is unauthenticated** — anyone who guesses `idA-idB` reads the conversation. Add `authMiddleware` + room-membership check.
6. **No socket authentication / room authorization** — clients can join arbitrary rooms.
7. **`POST /api/admin/upload` has no admin guard** while sibling admin routes do.
8. **OTP leaked in API response** when email send fails (`adminRoutes.js`), and `devOtp` returned to the client — gate strictly behind a dev-only flag.
9. **No input validation, rate limiting, or security headers** — register/login are open to brute force and injection; add `express-validator`/`joi`, `express-rate-limit`, `helmet`.

### 4.2 HIGH — Architecture & Correctness
10. **Dual database** (Mongo for everything, Postgres+Prisma for one Admin model) — operational overhead and split source of truth. Recommend consolidating Admin into MongoDB and removing Prisma/`pg`/`prisma.config.ts`.
11. **`chatRoutes.js` populates non-existent fields** (`username`, `profile.firstName`) — User schema has `name`, `email`, `profileImage`. Returns nulls.
12. **Frontend Socket.IO is not a singleton** — `Chat.jsx` and `Teams.jsx` create new connections per render/action, risking duplicate listeners and leaks. Centralize one socket instance/context.
13. **`Dashboard.jsx` uses dynamic `require('../services/api')`** instead of ES module imports — fragile under bundling.
14. **No global user/auth context** — profile is fetched independently in Navbar, Sidebar, Dashboard, Chat, and Profile. Add a `UserContext`/`AuthContext`.
15. **Silent failures & mock data on the frontend** — `HackathonDetails.jsx` shows hardcoded fallback hackathon data on API error; participant counts are `Math.random()`/`|| 42`; `Dashboard` swallows errors. Misleads users and reviewers.
16. **`alert()` for UX** in `HackathonDetails.jsx` while the rest of the app uses toasts.
17. **No DB transactions** for multi-step ops (accept-request), risking inconsistent state.

### 4.3 MEDIUM — Quality & Hygiene
18. **No automated tests** anywhere. Backend `test` script is the npm default error stub; CRA test libs installed but unused (`App.test.js` boilerplate only). `backend/testFetch.js` / `testQuery.js` are ad-hoc scripts, not tests.
19. **No CI/CD, Dockerfile, or deploy config**, despite commits referencing "trial hosting" / "deployment prep."
20. **No `.env.example`** in either app — onboarding requires guessing 13+ vars.
21. **Duplicate/unused code:** `Signup.jsx` (superseded by `Register.jsx`) unused; `App.css` auth classes only used by it; Navbar links to `/internships` with no route/page.
22. **Redundant dependencies:** both `bcrypt` and `bcryptjs` installed (only `bcryptjs` used); `mongodb` installed but Mongoose abstracts it.
23. **~28+ `console.log/error`** in backend (per-socket connect/disconnect spam) and several in frontend — no logging library (`pino`/`winston`) and no request logging (`morgan`).
24. **Inconsistent API response shapes** and **inconsistent auth wiring** (router-level `router.use(auth)` vs per-route middleware).
25. **No pagination** — `GET /api/users` returns all users; admin lists hardcode 50. Frontend pagination buttons and the "sort" select are non-functional.
26. **Tooling gaps:** no ESLint/Prettier config, no `tailwind.config.js`, mixed styling (Tailwind + inline + `App.css`).
27. **Repo hygiene:** root `.gitignore` only ignores `.DS_Store`; `.DS_Store` files present; `prisma.config.ts` is TS inside a CommonJS backend; `Roadmap.md` is empty; weak env separation.

### 4.4 Documentation Issues
28. **14 overlapping docs** with duplication (problem/vision/stack repeated across `README`, `project_documentation.md`, `Project_Overview.md`) and **stale/stub** files (`API_Documentation.md` ~49 lines, `Architecture.md` skeletal, `Roadmap.md` empty).
29. **Implemented-but-undocumented features:** Admin portal, OAuth, Cloudinary uploads, OTP — present in code, absent from the primary docs. **Documented-but-unbuilt:** Internship module (has a `DB_Schema` entry, no implementation), recruiter portal, reputation scoring.

---

## 5. What's Remaining (Gap List)

- **Phase-2 product:** Internship recommendations, recruiter/company dashboards, reputation/verification scoring, smarter (AI) matching beyond "+10 per shared skill," a React admin panel (currently EJS-only).
- **Functional gaps:** working pagination + sorting on hackathons; real participant/"joined" counts; team-request acceptance edge cases; `/internships` route (or remove the link); message-read/notification states.
- **Engineering gaps:** auth/user context, socket singleton, validation, rate limiting, helmet, structured logging, tests, CI/CD, `.env.example`, DB consolidation, error boundaries, deployment runbook.

---

## 6. Implementation Plan (Phased)

**Phase 0 — Security remediation (do first, ~0.5 day)**
- Rotate every secret in `backend/.env`; confirm not in git history (purge with `git filter-repo`/BFG if found).
- Replace `JWT_SECRET` with a strong random value.
- Move OAuth callback URLs to env (`config/passport.js`).
- Lock Socket.IO CORS to `FRONTEND_URL`; add a socket auth handshake.
- Protect `GET /api/chat/:roomId` (auth + membership) and `POST /api/admin/upload` (admin guard).
- Stop returning OTP/`devOtp` outside an explicit dev flag.
- Add `helmet`, `express-rate-limit`, and `express-validator` to auth routes.
- Add `backend/.env.example` and `frontend/.env.example`.

**Phase 1 — Correctness & consistency (~1–2 days)**
- Fix `chatRoutes.js` populate fields → `name email profileImage`.
- Frontend: add `Auth/UserContext` + Axios as single token source; remove duplicated `REACT_APP_API_URL` literals; convert `Dashboard.jsx` `require()` to imports; replace `alert()` with toasts; add an ErrorBoundary; remove silent mock/fallback data (show real error/empty states).
- Make a singleton Socket.IO client/context; ensure listener cleanup.
- Remove dead code (`Signup.jsx`, unused `App.css`), the `/internships` link (or build the page), and the redundant `bcrypt`/`mongodb` deps.

**Phase 2 — Architecture (~2–3 days)**
- Consolidate Admin into MongoDB (new Mongoose `Admin` model); remove Prisma, `pg`, `prisma.config.ts`, the Postgres URL. (Alternative: commit fully to Prisma — not recommended given the rest is Mongoose.)
- Standardize API response shape `{ success, message, data }` and auth-middleware usage.
- Add pagination to `/api/users` and wire frontend pagination/sort.
- Wrap multi-step team ops in transactions.

**Phase 3 — Quality & DevOps (~2–3 days)**
- Structured logging (`pino`) + `morgan`; strip debug `console.log`s.
- Tests: Jest + Supertest for backend (auth, team, hackathon, chat); React Testing Library for key components/flows.
- ESLint + Prettier + Husky pre-commit; add `tailwind.config.js`.
- Dockerfiles + `docker-compose`; GitHub Actions (lint, test, build); `DEPLOYMENT.md` runbook.
- Improve root `.gitignore`; remove `.DS_Store`; move/delete `testFetch.js`/`testQuery.js`.

**Phase 4 — Docs consolidation (~0.5 day)**
- Collapse 14 docs into: `README.md` (overview + setup), `docs/ARCHITECTURE.md`, `docs/API.md` (complete endpoint reference), `docs/ROADMAP.md`. Document the Admin/OAuth/Cloudinary/OTP features; remove stubs and duplication.

**Phase 5 — Phase-2 features (backlog)**
- Internships, recruiter dashboards, reputation scoring, AI matching, React admin panel.

---

## 7. Quick-Win Checklist (highest value, lowest effort)

- [ ] Rotate secrets + set a strong `JWT_SECRET`
- [ ] Auth-protect `/api/chat/:roomId`; guard admin upload
- [ ] Lock Socket.IO CORS to the frontend origin
- [ ] OAuth callbacks + frontend URL from env (no localhost literals)
- [ ] Add `.env.example` files
- [ ] Fix chat `populate` fields
- [ ] Replace `alert()` with toast; remove mock/fallback data
- [ ] Singleton socket + `AuthContext`
- [ ] Drop `bcrypt`/`mongodb` duplicate deps; delete `Signup.jsx`
- [ ] Add `helmet` + rate limiting + validation

---

## 8. Verification

If Phase-0 remediation is executed, verify: secrets rotated and app still boots (`npm start` in both apps); chat history returns 401 without a token; Socket.IO rejects non-`FRONTEND_URL` origins; OAuth login round-trips on the deployed URL; and `git log --all -- backend/.env` shows no committed secrets.

---

## Appendix — API Endpoint Reference (current)

**Auth** (`/api/auth`): `POST /register`, `POST /login`, `GET /google`, `GET /google/callback`, `GET /github`, `GET /github/callback`.
**Users** (`/api/users`): `GET /` (all, no pagination), `GET /profile`, `GET /profile/:id`, `PUT /profile`, `GET /recommendations`.
**Hackathons** (`/api/hackathons`): `GET /` (filters: mode, domain, search), `GET /:id`.
**Team** (`/api/team`): `POST /create`, `GET /my-teams`, `GET /:id`, `POST /:id/request`, `PUT /:id/accept`.
**Chat** (`/api/chat`): `GET /my-chats`, `GET /:roomId` *(currently unauthenticated — fix)*.
**Admin** (`/api/admin`): `POST /login`, `POST /verify`, `POST /upload` *(currently unguarded — fix)*, `POST /hackathons`, `POST /hackathons/:id/delete`.
**EJS (SSR, admin):** `GET /status`, `GET /dashboard`, `GET /users`, `GET /hackathons`, `GET /upload`.
