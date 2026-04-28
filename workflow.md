# HackConnect System Workflow

This document outlines the operational flow of the HackConnect application, detailing how data moves between the user interface, the backend logic layer, and the database.

## 1. Application Navigation Flow (User Journey)

### 1.1 Unauthenticated User Flow
1. **Landing Page (`/`):** User arrives at the public homepage explaining the platform's value proposition.
2. **Signup/Login (`/signup`, `/login`):** User creates an account using a verified college email. 
3. **Authentication Boundary:** If the user attempts to access `/dashboard`, `/teams`, or `/chat` without logging in, the React `<ProtectedRoute>` component immediately intercepts the request and redirects them back to `/signup`.

### 1.2 Authenticated User Flow
1. **Dashboard (`/dashboard`):** Post-login, the backend validates the JWT and returns the user's profile. The Dashboard displays their current skills, active team requests, and upcoming saved hackathons.
2. **Hackathon Discovery (`/hackathons`):** 
   - User navigates to the Hackathons page.
   - Frontend calls `GET /api/hackathons`.
   - User applies filters (e.g., Domain = 'AI'). Frontend updates the query: `GET /api/hackathons?domain=AI`.
3. **Team Formation (`/teams`):**
   - User wants to find teammates. Frontend calls `GET /api/users/recommendations`.
   - Backend calculates a `matchScore` based on complementary skills and returns a sorted list of ideal teammates.
   - User clicks "Send Request". Frontend fires `POST /api/team/:id/request`.
4. **Communication (`/chat`):** User clicks the "Message" icon in the Navbar, routing them to the internal messaging system.

---

## 2. Real-Time Chat Data Flow (Socket Architecture)

The chat system uses a "Persistence First, Broadcast Second" pattern to guarantee message delivery.

### 2.1 Initialization
1. User navigates to `/chat`.
2. `Chat.jsx` mounts and establishes a connection: `const socket = io(backend_url)`.
3. Frontend immediately makes an API call to `GET /api/profile` to retrieve the authentic User ID (preventing the `mock-id` bug).

### 2.2 Room Connection
1. User selects a chat thread (either a 1-on-1 contact or a Team Group).
2. Frontend calculates the Room ID:
   - *Group:* The Team's MongoDB `ObjectId`.
   - *1-on-1:* A concatenated, alphabetically sorted string of the two User IDs (e.g., `userA-userB`).
3. Frontend emits: `socket.emit('join_room', { roomId: "xyz" })`.
4. Backend assigns the socket connection to that specific memory room.
5. Frontend fetches history: `GET /api/chat/:roomId`.

### 2.3 Message Dispatch
1. User types "Hello" and hits send.
2. **Frontend Validation:** Checks if the message is empty or if no room is selected. If so, it aborts (preventing empty room crashes).
3. Frontend emits: `socket.emit('send_message', { roomId, senderId, text: "Hello" })`.
4. **Backend Processing:**
   - Server receives the socket payload.
   - Saves the payload to the MongoDB `Message` collection.
   - Populates the sender's `name` and `profileImage` (using corrected Schema references).
   - Server broadcasts the newly saved document to everyone in the room: `io.to(roomId).emit('receive_message', newMsg)`.
5. **Frontend Update:** The `socket.on('receive_message')` listener catches the incoming data and appends it to the React state array, triggering an immediate UI update.

---

## 3. Development & Contribution Workflow

When adding new features, follow this top-down integration approach:

1. **Database Schema:** Define the data structure in `backend/src/models/`.
2. **Backend Controller:** Write the business logic in `backend/src/controllers/`. Ensure appropriate `try/catch` blocks are used for MongoDB operations.
3. **API Route & Middleware:** Expose the controller via an Express route in `backend/src/routes/`. Protect the route using the `auth` middleware if it requires user context.
4. **Frontend Service Layer:** Add the Axios wrapper function in `frontend/src/services/api.js`.
5. **Frontend UI:** Build the React component, import the service function, and handle Loading/Error/Success states explicitly.
