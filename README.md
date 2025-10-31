## Gyming Buddies — Real‑Time Chat with Socket.io

A real‑time chat application for fitness enthusiasts. Users can join with a username, chat in a global room, see who is online, send private messages, view typing indicators, and receive notifications. Built with Express + Socket.io on the server and React + Vite on the client.

### Project overview
- **Stack**: Node.js, Express, Socket.io, React, Vite
- **Real‑time features**: Global chat, private DMs, online presence, typing indicators
- **Notifications**: Browser notifications and optional sound
- **UX**: Responsive layout, reconnection handling, unread counters for DMs

### Repository structure
```
.
├── client/                 # React + Vite app
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── styles.css
│       └── socket/
│           └── socket.js   # Socket.io client + hook
└── server/                 # Express + Socket.io server
    ├── server.js
    └── package.json
```

---

### Setup instructions

Prerequisites:
- Node.js v18+ (v20+ recommended)

1) Install dependencies
- Server
  - PowerShell:
    - `Set-Location -Path "C:\\Users\\Ariso\\real-time-communication-with-socket-io-WalterOluoch\\server"`
    - `npm install`
- Client
  - PowerShell:
    - `Set-Location -Path "C:\\Users\\Ariso\\real-time-communication-with-socket-io-WalterOluoch\\client"`
    - `npm install`

2) Environment variables (optional)
- `server/.env` (defaults will work if omitted):
  - `PORT=5000`
  - `CLIENT_URL=http://localhost:5173`
- `client/.env` (only if the server runs on a non‑default URL/port):
  - `VITE_SOCKET_URL=http://localhost:5000`

3) Run locally (two terminals)
- Server: in `server/` → `npm run dev`
- Client: in `client/` → `npm run dev` then open the printed URL (default `http://localhost:5173`).

---

### How to use
1. Open the client, choose a username, and click Enter Chat.
2. Use `# Global` for a shared chat with all online users.
3. Click a user in the sidebar to open a private chat thread with them.
4. Toggle notifications at login; you’ll receive browser notifications for new DMs. Add an audio file at `client/public/notify.mp3` for sound.

---

### Features implemented
- **Global chat**: Real‑time messaging in a global room
- **Username login**: Simple username join flow
- **Online presence**: Live user list updates on join/leave
- **Typing indicators**: See who is typing right now
- **Private messaging (DMs)**: One‑to‑one chat
- **Unread counters**: Badge shows unread DMs per user
- **Notifications**: Browser notifications (opt‑in) and optional sound
- **Reconnection**: Socket.io client reconnection enabled
- **Responsive UI**: Adjusts to desktop and mobile widths

Potential next enhancements (not required to run):
- Message pagination and search
- Delivery acknowledgments and read receipts
- Multiple named channels

---

### API and Socket events

Server HTTP endpoints:
- `GET /api/messages` — returns recent messages (in‑memory)
- `GET /api/users` — returns current online users

Socket events (client ⇄ server):
- `user_join` (client → server): announce the username
- `user_list` (server → client): full online list
- `user_joined` / `user_left` (server → client): presence notifications
- `send_message` (client → server): send a global message
- `receive_message` (server → client): broadcasted global message
- `typing` (client → server): boolean typing status
- `typing_users` (server → client): array of users currently typing
- `private_message` (bidirectional): send/receive 1‑1 messages

---

### Screenshots / GIFs


<img width="1920" height="1080" alt="Screenshot (1)" src="https://github.com/user-attachments/assets/add0e298-7b9f-476b-a1d3-a34484f20f69" />



---

### Scripts reference
- Server
  - `npm run dev` — start server with nodemon on `http://localhost:5000`
  - `npm start` — start server with node
- Client
  - `npm run dev` — start Vite dev server (default `http://localhost:5173`)
  - `npm run build` — production build
  - `npm run preview` — preview production build

---

### Troubleshooting
- If the client shows “Offline” with a connection error:
  - Ensure the server is running on `http://localhost:5000`.
  - If using a different port, set `VITE_SOCKET_URL` in `client/.env`.
- CORS: server is configured to allow `http://localhost:5173` and `http://127.0.0.1:5173`.
- Sound: add `client/public/notify.mp3` to enable the notification sound.

# Real-Time Chat Application with Socket.io

This assignment focuses on building a real-time chat application using Socket.io, implementing bidirectional communication between clients and server.

## Assignment Overview

You will build a chat application with the following features:
1. Real-time messaging using Socket.io
2. User authentication and presence
3. Multiple chat rooms or private messaging
4. Real-time notifications
5. Advanced features like typing indicators and read receipts

## Project Structure

```
socketio-chat/
├── client/                 # React front-end
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # UI components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── socket/         # Socket.io client setup
│   │   └── App.jsx         # Main application component
│   └── package.json        # Client dependencies
├── server/                 # Node.js back-end
│   ├── config/             # Configuration files
│   ├── controllers/        # Socket event handlers
│   ├── models/             # Data models
│   ├── socket/             # Socket.io server setup
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json        # Server dependencies
└── README.md               # Project documentation
```

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Follow the setup instructions in the `Week5-Assignment.md` file
4. Complete the tasks outlined in the assignment

## Files Included

- `Week5-Assignment.md`: Detailed assignment instructions
- Starter code for both client and server:
  - Basic project structure
  - Socket.io configuration templates
  - Sample components for the chat interface

## Requirements

- Node.js (v18 or higher)
- npm or yarn
- Modern web browser
- Basic understanding of React and Express

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete both the client and server portions of the application
2. Implement the core chat functionality
3. Add at least 3 advanced features
4. Document your setup process and features in the README.md
5. Include screenshots or GIFs of your working application
6. Optional: Deploy your application and add the URLs to your README.md

## Resources

- [Socket.io Documentation](https://socket.io/docs/v4/)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Building a Chat Application with Socket.io](https://socket.io/get-started/chat) 
