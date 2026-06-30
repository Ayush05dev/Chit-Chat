# 💬 Chit-Chat: Real-Time Chat Application

Chit-Chat is a modern, high-performance **Real-Time Chat Application** built using the **MERN** stack (MongoDB, Express, React, Node.js) combined with **Socket.io** for real-time, bidirectional communication. The application features secure authentication, active online status tracking, instant messaging, notification sound effects, and clean, responsive glassmorphic UI components.

---

## 🚀 Key Features

*   **⚡ Real-Time Messaging:** Send and receive messages instantaneously with sub-200ms latency.
*   **🟢 Online Status Tracker:** Live indicators displaying which users are currently online or offline.
*   **🔒 Secure Authentication:** JWT-based session management stored in `httpOnly` cookies for robust XSS protection, alongside bcryptjs password hashing.
*   **📁 Conversation Management:** Auto-generates conversations upon first message and fetches full message history seamlessly.
*   **🎭 Dynamic Profile Avatars:** Automatically assigns gender-based avatars using external avatar API generation.
*   **🔔 Interactive Feedback:** Audio notifications on new messages with a subtle shake animation to enhance user engagement.
*   **🎨 Glassmorphic Design:** Styled with Tailwind CSS and DaisyUI, featuring modern skeletons for loading states and fully responsive layouts.

---

## 🛠️ Tech Stack

### Frontend
*   **React 18** (Functional components, hooks, custom state management)
*   **Vite** (Next-generation, ultra-fast frontend build tool)
*   **Zustand** (Lightweight, high-performance global state management for messaging)
*   **Tailwind CSS & DaisyUI** (Utility-first styling framework with clean, modern components)
*   **Socket.io Client** (WebSocket wrapper for live events)
*   **React Hot Toast** (Elegant notification alerts)
*   **React Router Dom** (Dynamic client-side routing)

### Backend
*   **Node.js & Express.js** (Fast, unopinionated backend server runtime)
*   **MongoDB & Mongoose** (NoSQL Database and ODM for schema mapping and query construction)
*   **Socket.io** (Real-time socket connection engine)
*   **JSON Web Tokens (JWT)** (Stateless secure authentication)
*   **Bcryptjs** (Secure salt-hashed password storage)
*   **Cookie Parser** (Cookie extraction middleware)

---

## 📂 Project Structure

```
RealTimeChatAPP/
├── Backend/                    # Express & Socket.io server
│   ├── server.js              # Entry point (initializes Express, Socket.io, & MongoDB connection)
│   ├── db/                    # MongoDB connection helper
│   ├── models/                # Mongoose schemas (User, Message, Conversation)
│   ├── controllers/           # Route logic (Auth, Messages, Users)
│   ├── routes/                # Express API endpoints
│   ├── middleware/            # JWT Route Guards
│   ├── socket/                # Socket.io connection logic & user mapping
│   └── utils.js/              # Utility functions (JWT cookie generator, time extractor)
│
├── Frontend/                   # React (Vite) client
│   ├── src/
│   │   ├── components/        # Reusable UI components (Sidebar, Messages, Skeletons)
│   │   ├── context/           # React Context (AuthContext, SocketContext)
│   │   ├── hooks/             # Custom React Hooks (useLogin, useListenMessages, etc.)
│   │   ├── pages/             # Layouts & pages (Home, Login, SignUp)
│   │   ├── zustand/           # Zustand store (useConversation)
│   │   └── main.jsx           # React app entry point
│   ├── tailwind.config.js     # Tailwind setup
│   └── vite.config.js         # Vite configuration
```

---

## 🔌 API Reference

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Register a new user | `{ fullName, username, password, confirmPassword, gender }` |
| `POST` | `/login` | Authenticate user & issue JWT | `{ username, password }` |
| `POST` | `/logout` | Clear user session cookie | None |

### Messaging Routes (`/api/messages`)
| Method | Endpoint | Description | Headers / Cookies |
| :--- | :--- | :--- | :--- |
| `POST` | `/send/:id` | Send a message to user `:id` | Requires valid JWT cookie |
| `GET` | `/:id` | Fetch all messages with user `:id` | Requires valid JWT cookie |

### User Routes (`/api/users`)
| Method | Endpoint | Description | Headers / Cookies |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Fetch all users for the sidebar list | Requires valid JWT cookie |

---

## ⚙️ Environment Configuration

To run the project, you need to configure environmental variables. Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

---

## 🏃 Run Locally

Follow these steps to run the application in your local environment.

### 1. Clone the repository
```bash
git clone https://github.com/Ayush05dev/Chit-Chat.git
cd Chit-Chat
```

### 2. Configure Environment Variables
Create the `.env` file in the root folder as described in the **Environment Configuration** section.

### 3. Install Backend and Frontend Dependencies
Install all packages for both server and client:
```bash
# Install backend dependencies
npm install

# Install frontend dependencies (automatically handled by the build command or run manually)
cd Frontend
npm install
cd ..
```

### 4. Run the Application
You can run the backend and frontend in development mode.

**For Backend (Root folder):**
```bash
npm run dev
```

**For Frontend (Frontend folder):**
```bash
cd Frontend
npm run dev
```

*Note: In development, the frontend runs on [http://localhost:3000](http://localhost:3000) and the backend runs on [http://localhost:5000](http://localhost:5000).*

### 5. Production Build
To create a production build where Express serves the compiled static React assets:
```bash
# Run build command from the root directory
npm run build
```
This command compiles the React application into `/Frontend/dist` which is then statically served by the Express backend at `http://localhost:5000`.

---

## 📡 End-to-End WebSocket Flow
```
[User A Client] ───(HTTP POST /api/messages/send/UserB)───► [Express Server]
                                                                │
                                                        1. Saves to MongoDB
                                                        2. Looks up User B SocketId
                                                                │
[User B Client] ◄────────(Socket.io 'newMessage')───────────────┘
```

1. **Establishment:** When a user logs in, the `SocketContext` opens a WebSocket connection to the server, passing the `userId` in the handshake query.
2. **Registry:** The backend maps the `userId` to its active `socket.id` inside an in-memory `userSocketMap`.
3. **Presence:** The backend broadcasts the active list of user IDs via a `getOnlineUsers` event to all clients to toggle the green online indicators.
4. **Instant Transmission:** When User A sends a message to User B, the server saves the message to MongoDB, checks if User B is online in `userSocketMap`, and triggers `io.to(socketId).emit("newMessage", message)` to instantly push the payload.
5. **Consumption:** User B's `useListenMessages` hook intercepts the `newMessage` event, adds the message to the Zustand state, and triggers an audio notification.

---

## 🔒 Security Best Practices
*   **HttpOnly Cookies:** JWTs are stored as `httpOnly` cookies, preventing cross-site scripting (XSS) client-side access.
*   **Password Hashing:** Uses `bcryptjs` for secure password storage with 10 salt rounds.
*   **JWT Token Expiration:** Tokens automatically expire in 15 days to minimize session exposure risks.
*   **Route Protection Middleware:** All api routes (except login/signup) require validation via `protectRoute.js`.

---

## 💡 Contributing & Future Scope
*   **Message Pagination:** Implement cursor-based database pagination for infinite scrolling history.
*   **Typing Indicators:** Show visual dots when a participant is typing in real time.
*   **Group Chats:** Support rooms to facilitate multi-user channels.
*   **End-to-End Encryption (E2EE):** Encrypt payloads on the client-side before sending to server.

License: ISC
