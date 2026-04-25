# Frontend Master Handoff & Workflow Guide

This document contains everything you need to know to seamlessly continue frontend development. It is split into two parts: 
1. **Completed Backend Features:** APIs that are ready to be connected to the UI right now.
2. **Real-Time Chat Workflow:** The architectural plan and task priority for the upcoming Chat feature.

---

# PART 1: Completed Backend Features (Ready Now)

The backend has just been updated with the core features needed for the hackathon MVP. 

### 1. Update your `api.js` file
Copy and paste these new functions into your `frontend/src/services/api.js` file so your React components can call them:

```javascript
// --- Updated Hackathon Endpoint (Replace your existing one) ---
// Now supports filtering! Example: getHackathons('?mode=ONLINE&domain=Healthcare')
export const getHackathons = (query = '') => api.get(`/hackathons${query}`);

// --- New Team Endpoints ---
export const createTeam = (teamData) => api.post('/team/create', teamData);
export const getMyTeams = () => api.get('/team/my-teams');
export const sendTeamRequest = (teamId) => api.post(`/team/${teamId}/request`);
export const acceptTeamRequest = (teamId, data) => api.put(`/team/${teamId}/accept`, data);

// --- New Recommendation Endpoint ---
export const getRecommendedTeammates = () => api.get('/users/recommendations');
```

### 2. How to use them in the UI

*   **Team Formation:** 
    *   Attach `createTeam` to a "Create Team" button on the Hackathon details page. 
    *   Attach `sendTeamRequest(teamId)` to a "Join Team" button.
    *   Attach `acceptTeamRequest` to an "Accept" button on the leader's dashboard.
*   **Intelligent Teammate Recommendations (The USP!):** 
    *   Call `getRecommendedTeammates()` on a "Find Teammates" page. It automatically finds users looking for a team and calculates a `matchScore` (+10 points for every shared skill).
*   **Hackathon Filtering:**
    *   You can now build dropdowns on the frontend to filter hackathons. E.g. `getHackathons('?mode=ONLINE')` or `getHackathons('?search=AI')`.

---

# PART 2: Real-Time Chat (Upcoming Workflow)

To support both **1-on-1 direct messaging** (for finding teammates) and **Group Messaging** (for team communication), we are integrating WebSockets using `socket.io`. 

## Architecture Overview

1.  **Rooms:** To handle both 1-on-1 and Group chats without mixing messages, we will use Socket.io "Rooms".
    *   **Group Chat Room ID:** The MongoDB `ObjectId` of the Team.
    *   **1-on-1 Chat Room ID:** A combined string of both User IDs, sorted alphabetically (e.g., `userA_id-userB_id`).
2.  **Persistence:** Every time the backend receives a message via socket, it will **first** save it to the MongoDB `Message` collection, and **then** broadcast it to the room.

## Priority Task Workflow

**The backend must complete Step 1 & 2 before the frontend can connect.**

### Step 1: Backend Setup (Pending)
1.  **Dependencies:** Install `socket.io`.
2.  **Server:** Modify `server.js` to wrap the Express app in a Node HTTP server and configure CORS for websockets.
3.  **Database:** Create a `Message` schema in MongoDB.

### Step 2: Backend Socket Handlers (Pending)
*   **Event `join_room`:** Add the user's socket to the requested room.
*   **Event `send_message`:** Save to MongoDB, then emit a `receive_message` event to the room.
*   **REST API:** Create `GET /api/chat/:roomId` so the frontend can fetch old messages on load.

### Step 3: Frontend Integration (Pending)
1.  **Dependencies:** Run `npm install socket.io-client`.
2.  **Connect:** In `Chat.jsx`, establish connection: `const socket = io("http://localhost:5000")`.
3.  **Fetch History:** When clicking a chat, call `GET /api/chat/:roomId` to load old messages.
4.  **Join Room:** Emit the `join_room` event.
5.  **Send/Receive:** Emit `send_message` when typing, and set up a listener (`socket.on("receive_message")`) to update the UI instantly.

## The Socket Event Contract
*(Frontend and Backend must use these exact event names)*

| Event Name | Sent By | Data Payload Example | Purpose |
| :--- | :--- | :--- | :--- |
| `join_room` | Frontend | `roomId: "60d...123"` | Tells the server which chat the user opened. |
| `send_message` | Frontend | `{ roomId: "...", senderId: "...", text: "Hello!" }` | Sends a new chat message to the server. |
| `receive_message` | Backend | `{ _id: "...", sender: {...}, text: "Hello!", createdAt: "..." }` | Pushes the newly saved message to everyone in the room. |
