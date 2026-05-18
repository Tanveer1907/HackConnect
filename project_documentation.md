# HackConnect Project Documentation

## 1. Introduction

### 1.1 Background
The landscape of technology education and professional development has shifted significantly over the past decade. Hackathons have emerged as a premier avenue for college students to apply theoretical knowledge to practical, real-world problems. These intensive, time-constrained events foster innovation, rapid prototyping, and critical problem-solving skills. However, the success of a hackathon project is intrinsically tied to the quality and cohesion of the team executing it. Traditionally, students have been limited to forming teams within their immediate social or academic circles, which often results in homogeneous skill sets and limits the potential scope of their projects. 

The digital era demands a more interconnected approach. While professional networking platforms exist, they are broadly focused and do not cater specifically to the fast-paced, skill-specific requirements of hackathon team formation. Students frequently face the challenge of discovering relevant hackathon events scattered across various college websites and tech forums. Furthermore, verifying the authenticity of potential teammates' skills and academic standing is a cumbersome process when done manually. HackConnect was conceptualized to address these specific gaps, providing a centralized, verified, and intelligent ecosystem tailored exclusively for the college hackathon community. By bridging the gap between isolated talent pools across different institutions, HackConnect aims to democratize access to collaborative opportunities and elevate the overall quality of student-led technical innovation.

### 1.2 Objectives
The primary objective of the HackConnect project is to design, develop, and deploy a comprehensive web application that serves as the ultimate collaboration network for college students participating in hackathons. Specifically, the project aims to achieve the following:

1.  **Verified Authentication System:** To implement a secure registration and login mechanism that ensures all users are authenticated college students, utilizing official institutional email addresses and robust JWT (JSON Web Token) authorization.
2.  **Intelligent Team Formation Engine:** To engineer an advanced recommendation and matching algorithm that pairs students based on complementary technical skills, preferred roles (e.g., matching a frontend specialist with a backend developer), and past hackathon performance.
3.  **Centralized Hackathon Discovery:** To aggregate and categorize upcoming hackathon events, providing an easily navigable and filterable dashboard for students to discover opportunities relevant to their interests.
4.  **Real-Time Seamless Communication:** To integrate a full-duplex WebSocket communication layer (using Socket.io) that facilitates both one-on-one and group messaging, enabling prospective and existing teams to collaborate instantly without relying on third-party messaging apps.
5.  **Robust Security and Data Integrity:** To ensure data privacy and system security through protected routing, password hashing (bcrypt), and strict database schema validation.
6.  **Scalable Architecture:** To build a foundation using the MERN stack (MongoDB, Express.js, React.js, Node.js) that can scale to support a large concurrent user base and accommodate future features like internship recommendations and recruiter dashboards.

### 1.3 Significance of the Project
The significance of HackConnect extends beyond being just another networking application; it is a specialized tool designed to accelerate student career trajectories. 

Firstly, **Skill Diversification and Cross-Pollination:** By breaking down geographical and institutional barriers, HackConnect allows students to collaborate with peers possessing complementary skills. A UI/UX designer from one college can seamlessly team up with a machine learning engineer from another, leading to the creation of vastly superior hackathon projects.

Secondly, **Streamlined Opportunity Discovery:** The platform eliminates the friction of searching for hackathons. By providing a curated list of events, students can spend less time searching and more time preparing and building. 

Thirdly, **Verified Credibility:** The platform's emphasis on verified college emails and detailed user profiles creates an environment of trust. Users can confidently form teams knowing that their peers possess the skills they claim to have.

Finally, **Pathway to Professional Opportunities (Future Scope):** HackConnect serves as a living portfolio. The teams formed and the projects completed via the platform provide tangible proof of a student's capabilities. In its future phases, the platform's data will be leveraged to connect top-performing students directly with recruiters, transforming hackathon participation into actionable internship and employment opportunities.

---

## 2. Problem Definition and Requirements

### 2.1 Problem Statement
College students across India frequently express a strong desire to participate in hackathons to hone their skills and build their resumes. However, they consistently encounter three major obstacles. 
1.  **The Teammate Bottleneck:** Students often struggle to find reliable, skilled teammates outside their immediate social circles. A backend developer might have a brilliant idea but lacks the frontend expertise to execute it, leading to abandoned projects or sub-par submissions. 
2.  **Information Fragmentation:** Discovering relevant hackathons is a disjointed process, with information scattered across disparate college websites, social media groups, and various tech portals.
3.  **Lack of Specialized Collaboration Platforms:** Existing professional networks (like LinkedIn) are too broad for rapid, skill-based team formation required for time-sensitive events like hackathons. Consequently, students resort to using generic messaging apps (WhatsApp, Discord) to find teammates, which lacks verification, skill-matching capabilities, and structured project management tools.

**Proposed Solution:** HackConnect solves this by offering a unified, verified platform where students can showcase their skills, discover hackathons, and utilize an intelligent matching system to dynamically form well-balanced teams based on complementary skill sets.

### 2.2 Software Requirements
To ensure optimal performance, development, and deployment of the HackConnect application, the following software specifications are required:

*   **Operating System:** Cross-platform compatibility (Windows 10/11, macOS, Linux) for development and client access.
*   **Frontend Technologies:**
    *   **React.js (v18+):** For building a dynamic, component-based user interface.
    *   **Tailwind CSS:** For rapid, utility-first styling and responsive design.
    *   **React Router:** For client-side routing and implementing Protected Routes.
    *   **Socket.io-client:** For establishing real-time WebSocket connections.
*   **Backend Technologies:**
    *   **Node.js (v16+):** As the JavaScript runtime environment.
    *   **Express.js:** As the web application framework for building RESTful APIs.
    *   **Socket.io:** For full-duplex, real-time chat infrastructure.
*   **Database Management:**
    *   **MongoDB:** A NoSQL database for flexible, document-oriented data storage.
    *   **Mongoose (ODM):** For object data modeling and schema validation.
*   **Security & Authentication:**
    *   **JSON Web Tokens (JWT):** For stateless, secure API authorization.
    *   **Bcrypt.js:** For cryptographic hashing of user passwords.
*   **Development Tools:**
    *   **Visual Studio Code:** Primary IDE.
    *   **Git & GitHub:** For version control and collaborative development.
    *   **Postman:** For comprehensive API endpoint testing and validation.

### 2.3 Hardware Requirements
*   **Development Environment (Minimum):**
    *   **Processor:** Intel Core i5 or AMD Ryzen 5 equivalent.
    *   **RAM:** 8 GB (16 GB recommended for running local servers and databases simultaneously).
    *   **Storage:** 256 GB SSD.
    *   **Network:** Stable internet connection for package management and cloud database access.
*   **Server / Deployment Environment:**
    *   **Frontend Hosting:** Cloud-based edge network (e.g., Vercel or Netlify).
    *   **Backend Hosting:** Minimum 1 vCPU, 512MB RAM instance (e.g., Render, AWS EC2, or Heroku).
    *   **Database Hosting:** MongoDB Atlas cluster (M0 sandbox for development, easily scalable for production).

### 2.4 Data Sets
The application relies on several core data structures stored as JSON documents in MongoDB:
*   **Users:** Stores authentication credentials, profile details (name, college, bio), skill arrays, preferred roles, and a history of hackathon participation.
*   **Hackathons:** Contains event details including title, description, dates, themes/categories, and registration links.
*   **Teams:** Records team composition (leader, members), team status, required roles, and associated hackathon IDs.
*   **Messages:** Stores chat logs, including sender IDs, room/team references, timestamps, and message content for persistence.

---

## 3. Proposed Design / Methodology

### 3.1 Development Methodology
The project adheres to the **Agile Development Methodology**, characterized by iterative development cycles, continuous integration, and rapid adaptation to feedback. This approach allows the development team to modularize the application into manageable sprints (e.g., Sprint 1: Authentication, Sprint 2: Profiles & Hackathons, Sprint 3: Team Matching & Real-Time Chat). By utilizing Agile, the team ensures that core functionalities are stable before advancing to complex features, thereby mitigating systemic risks.

### 3.2 System Architecture (MVC Pattern)
HackConnect is built upon a robust implementation of the **Model-View-Controller (MVC)** architectural pattern, which strictly separates application logic into three interconnected elements:

1.  **Model (Data Layer):** Implemented using Mongoose schemas. It defines the structure of data (Users, Teams, Messages) and handles all database interactions.
2.  **View (Presentation Layer):** Handled entirely by the React.js frontend. It dynamically renders the UI based on state changes and communicates with the backend via RESTful APIs. (Fallback Server-Side Rendering is also available via EJS templates for specific status pages).
3.  **Controller (Business Logic Layer):** Comprises Express.js functions that receive client requests, process business rules (e.g., hashing passwords, calculating match scores), query the Models, and return structured JSON responses.

#### Schematic Architecture Flow
```text
[ Client Browser (React SPA) ]
         |
         | (HTTP/REST APIs & WebSockets)
         v
[ Node.js / Express Server ] <------> [ Socket.io Chat Server ]
         |
    (Controllers & Routes)
         |
         | (Mongoose ODM)
         v
[ MongoDB Database (Atlas) ]
```

### 3.3 Modular Component Design
The system is divided into highly cohesive, loosely coupled modules:

1.  **Authentication & Security Module:**
    *   Manages user registration and login.
    *   Implements `bcrypt` to salt and hash passwords before storage.
    *   Generates JWTs upon successful login, which are required for accessing protected routes. An Express middleware validates these tokens on every restricted API call.
2.  **Intelligent Team Formation Engine:**
    *   This is the core business logic. When a user seeks a team, the algorithm queries the database and calculates a `matchScore`.
    *   The logic factors in shared skills (+points), complementary roles (e.g., connecting a user looking for a frontend developer with a user who identifies as one), and past experience, ensuring high-quality team recommendations.
3.  **Real-Time Chat System (WebSocket):**
    *   Built alongside the HTTP server using `socket.io`.
    *   **Hybrid Architecture:** Supports both *Group Chat Rooms* (bound to a Team's unique MongoDB ObjectId) and *1-on-1 Rooms* (bound to a deterministic composite string of two User IDs).
    *   **Persistence:** Messages are written to the MongoDB `Messages` collection *before* broadcasting to the socket room, guaranteeing zero data loss if a client disconnects unexpectedly.

### 3.4 File and Directory Structure
To maintain scalability and readability, the codebase is strictly organized:

```text
HackConnect/
├── backend/                    # Express REST API & Socket server
│   ├── src/
│   │   ├── controllers/        # Business logic (e.g., userController.js, authController.js)
│   │   ├── models/             # Mongoose Schemas (User.js, Team.js, Message.js)
│   │   ├── routes/             # API endpoint definitions mapping to controllers
│   │   └── middleware/         # Custom middleware (authMiddleware.js for JWT validation)
│   ├── views/                  # EJS templates for SSR fallbacks
│   ├── .env                    # Environment variables (DB URI, Secrets)
│   └── server.js               # Main entry point, Express config & Socket.io initialization
│
└── frontend/                   # React Single Page Application
    ├── public/                 # Static assets
    ├── src/
    │   ├── components/         # Reusable UI components (Navbar, Buttons, Modals)
    │   ├── pages/              # Full page components (Dashboard, Chat, Home)
    │   ├── services/           # API abstraction layer (api.js for Axios calls)
    │   ├── context/            # React Context API for global state management
    │   ├── index.css           # Global Tailwind CSS configurations
    │   └── App.js              # Application routing and ProtectedRoute wrappers
    ├── package.json            # Frontend dependencies
    └── tailwind.config.js      # Tailwind customization
```

This proposed design guarantees a separation of concerns, making the codebase highly maintainable. The decoupled nature of the React frontend and Node/Express backend also means that mobile applications (e.g., React Native) could be integrated in the future without modifying the underlying backend logic.
