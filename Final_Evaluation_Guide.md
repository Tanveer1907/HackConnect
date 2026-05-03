# HackConnect: Comprehensive Evaluation & Project Guide

This document is specifically crafted for your project evaluation. It covers every concept from your syllabus and answers all the specific questions you were asked regarding the architecture, flow, and components of the **HackConnect** application.

---

## 1. MVC Architecture (Model-View-Controller)

### What is MVC and Why is it Important?
MVC is a software design pattern that separates an application into three main logical components: **Model**, **View**, and **Controller**.
- **Importance:** It provides "Separation of Concerns." It keeps the data layer completely separate from the presentation layer. If we want to change the UI (View), we don't have to touch the database logic (Model).
- **Why not put everything in one folder?** If everything (database logic, routing, HTML, and business rules) is in one file/folder, the code becomes a "spaghetti" mess. It becomes impossible to read, debug, test, or collaborate with a team. Separation makes the codebase modular and scalable.

### MVC in HackConnect Codebase
- **Model (Database Layer):** Represents your data structure. These are the files in `backend/src/models/` (e.g., `User.js`, `Team.js`, `Hackathon.js`). They define the MongoDB schema using Mongoose.
- **View (Presentation Layer):** What the user sees. In modern apps, this is usually the React frontend (`frontend/src/`). For Server-Side Rendering (SSR) fallback, you also have `backend/views/status.ejs`.
- **Controller (Business Logic Layer):** The brain. These are the files in `backend/src/controllers/` (e.g., `userController.js`, `authController.js`).

### Controller kya karta hai? (What does a Controller do?)
The Controller is the middleman between the Model and the View. When a user makes a request (e.g., clicks "Login"), the Controller:
1. Receives the request from the Router.
2. Extracts data from the request body or parameters.
3. Asks the Model to fetch or save data in the database.
4. Formats that data and sends a response (JSON) back to the View (Frontend).

### Data kon provide karta hai? (Who provides the data?)
The **Database (MongoDB)** stores the actual data. The **Model** fetches it from the database, and the **Controller** provides it to the frontend via an API response.

### Where is the Service?
In many large enterprise apps, there is a separate `services/` folder that handles complex business logic to keep Controllers thin. In HackConnect, the **Controller is acting as the Service layer**. All the logic (like hashing passwords, formatting team data, matching scores) is currently written inside the files in `controllers/`.

### What is the flow / Next step in MVC?
**The Request Flow:**
1. **Client (View):** User clicks a button in React. React sends an HTTP Request to the API.
2. **Router:** The request hits `server.js` -> routes to `src/routes/userRoutes.js`.
3. **Controller:** Router forwards it to `userController.js`.
4. **Model:** Controller calls `User.findById()`.
5. **Database:** Model fetches data from MongoDB and returns it to Controller.
6. **Response:** Controller sends `res.json(data)` back to the View.

---

## 2. API, Endpoints, and Routing

### What is an API and What are Endpoints?
- **API (Application Programming Interface):** A set of rules that allows the React frontend to communicate with the Node.js backend.
- **Endpoint:** A specific URL where an API can be accessed. Examples in your app: `/api/users/login`, `/api/teams/create`.

### Router kaha hota hai? (Where is the Router?)
The routers are located in `backend/src/routes/` (e.g., `authRoutes.js`, `teamRoutes.js`).
- **What it does:** It maps a specific URL endpoint to a specific Controller function.
- **Example:** `router.post('/login', authController.loginUser);`

### Agar logic ka part router mai likha hoga to kyu likha vo batao? (Why put logic in Router?)
Ideally, logic **should not** be in the router. The router should only map URLs to Controllers. However, if logic is written there, it is usually for:
1. Quick, simple validation checks before hitting the controller.
2. Applying Middleware (e.g., `router.get('/profile', authMiddleware, getProfile)`).
3. If the logic is so tiny (like a simple `res.send("OK")`) that creating a controller feels like overkill.

---

## 3. Creating & Updating APIs

### How to write an API?
1. **Create the Route:** In `routes/userRoutes.js`, define the endpoint: `router.put('/:id', userController.updateUser);`
2. **Create the Controller Function:** In `controllers/userController.js`, write the logic.
3. **Test the API:** Using Postman or your frontend.

### Update keyword kaise use kroge? / How to take update user API?
If you want an API to update a user's profile:
```javascript
// In backend/src/controllers/userController.js
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id; // Get ID from URL
        const updateData = req.body;  // Get new data from frontend

        // 'update' keyword context: We use Mongoose's findByIdAndUpdate
        // { new: true } ensures it returns the updated document
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        res.json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
}
```

---

## 4. Node.js Concepts & Middleware

### What are Core Modules?
Core modules are built-in modules in Node.js that you can use without installing them via NPM.
- Examples: `http` (to create servers), `fs` (file system, to read/write files), `path` (to manipulate file paths).

### What is Middleware?
Middleware functions are functions that have access to the `request (req)`, `response (res)`, and the `next` function in the application's request-response cycle. They execute code *in the middle* of a request.
- **Middleware lifecycle:** Request comes in -> passes through Middleware 1 -> Middleware 2 -> hits Controller -> Response goes out.
- **Application-level:** Runs for every single request (`app.use(cors())`, `app.use(express.json())`).
- **Router-level:** Applied only to specific routes (e.g., checking if a user is logged in before accessing `/dashboard`).
- **Third-party:** Written by others, like `Body parser` (now built into express as `express.json()`), which converts incoming JSON string data into a JavaScript object.

### SSR vs CSR & Template Engines
- **CSR (Client-Side Rendering):** React (JSX) runs in the user's browser, fetching raw JSON data from the API and building the HTML elements on the user's computer. (This is what HackConnect mostly uses).
- **SSR (Server-Side Rendering):** The Node.js backend generates the full HTML page and sends it to the browser.
- **Why use HTML/Template Engines (EJS/HBS) when you have JSX?** Sometimes you need a simple, fast, static page (like an email template, a basic status page, or an invoice) where sending a whole React bundle is too heavy. HackConnect uses EJS in `backend/views/status.ejs` for simple server-rendered pages.

---

## 5. Security: JWT & Bcrypt

### What is JWT? (JSON Web Token)
JWT is a secure string (token) used to prove a user's identity. Since HTTP is "stateless" (the server forgets you after every request), you must send this token with every request to say, "Hey, I am still logged in."

### Why Bcrypt? How to hash the token/password?
You **never** save plain-text passwords in the database (if the DB is hacked, users are compromised).
- **Bcrypt:** A library that scrambles (hashes) the password mathematically. It adds a "salt" (random string) to make it impossible to reverse-engineer.
- **How to hash:**
```javascript
// In authController.js
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash("userPassword123", salt);
```

### Tell me the full process from Token Generation to Connecting
1. **Login:** User sends email & password to `/api/auth/login`.
2. **Verification:** `authController` checks if the user exists. It uses `bcrypt.compare()` to match the entered password with the hashed password in MongoDB.
3. **Generation:** If they match, `jwt.sign()` generates a token containing the user's ID.
4. **Sending:** The server sends this token to the frontend React app.
5. **Placing the Token:** The frontend saves it in `localStorage`.
6. **Connecting (Subsequent Requests):** For future requests (like fetching their team), the frontend attaches the token in the headers: `Authorization: Bearer <token>`. The backend middleware verifies it using `jwt.verify()`.

---

## 6. Miscellaneous Questions

### Agar mujhe user mai class name change Krna hai to kya karna higa?
- **If you mean CSS Class Name in Frontend:** Open the React component (e.g., `Profile.jsx`) and change `className="old-class"` to `className="new-class"`.
- **If you mean the Model Class Name in Backend:** Go to `models/User.js`. If you want to rename the Mongoose model from `User` to `Student`, change `module.exports = mongoose.model('User', UserSchema);` to `module.exports = mongoose.model('Student', UserSchema);`.

### Databases & ODM (Mongoose)
- **SQL vs NoSQL:** SQL (MySQL) uses rigid tables with rows/columns. NoSQL (MongoDB) uses flexible JSON-like documents, perfect for Javascript applications.
- **Mongoose (ODM - Object Data Modeling):** It acts as a translator between our Node.js objects and the MongoDB database. It allows us to define rigid schemas (like stating `email` must be a string and is required) for our flexible NoSQL database.

### Socket.io (Full Duplex Communication)
HTTP is one-way (Client asks, Server answers). WebSockets (`socket.io`) enable **Full Duplex**, meaning the server can push messages to the client at any time without the client asking. This is how HackConnect's real-time chat works seamlessly.
