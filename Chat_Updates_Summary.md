# HackConnect Chat System & Architecture Updates

This document summarizes all the backend and frontend changes implemented to fix the real-time chat infrastructure, secure the application routes, and polish the user interface.

## 1. Backend Chat Logic & Database Validation Fixes
**Files Modified:** `backend/server.js`, `backend/src/controllers/chatController.js`

*   **Socket Message Sender Issue:** The `server.js` was strictly looking for `data.senderId` in the socket payload. However, some frontend components were sending `sender`, while others sent nothing because of local storage issues. The backend crashed and rejected the payload. 
    *   **Fix:** Updated the socket handler to safely accept `data.senderId || data.sender`.
*   **"Anonymous / User undefined" Bug:** When receiving messages, the backend attempted to populate the user's name by querying `profile.firstName` and `profile.lastName`. However, the MongoDB User Schema stores the name simply as `name`. Because `profile.firstName` was undefined, it sent back missing data, causing the chat UI to display "Anonymous" or "User @user".
    *   **Fix:** Updated both the `populate` query in `server.js` and the `.select()` query in `chatController.js` to correctly pull `name`, `username`, and `profileImage`.

## 2. Global Route Protection & Authentication Guard
**File Modified:** `frontend/src/App.js`

*   **Security Vulnerability:** Unauthenticated users were able to access internal pages (like Dashboard, Chat, and Teams) by manually typing the URL or clicking random links.
*   **Fix:** 
    *   Implemented a `<ProtectedRoute>` wrapper component.
    *   Wrapped all internal routes (`/dashboard`, `/chat`, `/teams`, `/profile`, `/hackathons`, `/hackathon/:id`) inside this guard.
    *   If a user without a valid JWT token tries to access these pages, they are instantly redirected to the `/signup` page.
    *   The Home page (`/`) remains public.

## 3. Real-Time Chat System Reliability
**File Modified:** `frontend/src/pages/Chat.jsx`

*   **Empty Room Crash:** Users could type a message and press "Send" even if they hadn't clicked on a chat yet. This fired a socket event with an empty `roomId`, crashing MongoDB.
    *   **Fix:** Added an early return `if (!message.trim() || !currentRoom) return;` to completely prevent sending messages into the void.
*   **Messages Not Delivering (The `mock-id` bug):** When a user was in the Chat page and sent a message, the frontend was trying to pull their User ID from `localStorage.getItem('user')`. However, the login system only stores the `token`, never the `user`. This caused the chat to default to sending `'mock-id'` as the sender. The backend rejected this as an invalid MongoDB ID.
    *   **Fix:** Completely removed the mock local storage fallback. The Chat page now makes an API call (`getUserProfile()`) as soon as it loads to fetch the authentic user data and uses their actual `_id` to send messages.

## 4. UI Polish & Layout Adjustments
**Files Modified:** `frontend/src/pages/Chat.jsx`, `frontend/src/App.js`, `frontend/src/components/Navbar.jsx`, `frontend/src/pages/Teams.jsx`

*   **Chat Container Overflow (Scrollbar Issue):** The chat window was overflowing the screen, causing a double scrollbar on the far right. Trying to mathematically calculate the Navbar height (`calc(100vh - 80px)`) was inaccurate.
    *   **Fix:** Used `useLocation` inside `App.js` to detect when the user is on the `/chat` route. If they are, the entire app container locks to `h-screen overflow-hidden`. The Chat component was updated to `flex-1 min-h-0`, forcing it to magically fill the exact remaining space left by the Navbar without ever overflowing.
*   **Navbar Notifications:** The Bell icon in the Navbar now actively queries `getMyChats()` when the page loads. If there are active chats or invitations, it renders a red notification dot. Clicking it routes directly to the inbox.
*   **Team Invitation Feedback:** Clicking "Send Invitation" on the Teams page previously closed silently. It now triggers a success alert so the user knows the message actually sent via websockets.
