Realtime Chat Backend — Learning Notes
1. Goal

Add realtime messaging to a REST chat API using Socket.IO.

Architecture combines:

REST API  → data persistence
Socket.IO → realtime delivery
MongoDB   → message storage
JWT       → authentication
2. System Architecture
Client
  │
  ├── REST API
  │     POST /messages
  │     GET /conversations/:id/messages
  │
  └── WebSocket (Socket.IO)
        join_conversation
        new_message

Flow:

Client sends message
      │
      ▼
REST API saves message in MongoDB
      │
      ▼
Server emits socket event
      │
      ▼
Clients in same room receive message instantly
3. Server Initialization

HTTP server wraps Express.

const server = createServer(app);

initSocket(server);

server.listen(PORT);

Why?

Express handles HTTP
Socket.IO attaches to HTTP server
4. Socket Initialization

socket.server.js

io = new Server(server, {
  cors: { origin: "*" }
});

Responsibilities:

initialize socket server
JWT authentication
handle connection
manage rooms
broadcast events
5. Socket Authentication

Socket uses JWT middleware.

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  const decoded = jwt.verify(token, JWT_SECRET);

  socket.user = {
    id: decoded.sub
  };

  next();
});

Client sends access token.

socket = io(serverURL,{
  auth:{ token: accessToken }
})

Important rule:

Access Token → authentication
Refresh Token → generate new access token
6. Connection Event

Triggered when client connects.

io.on("connection",(socket)=>{
  console.log("User connected", socket.user.id);
});

Server now knows which user is connected.

7. Room System

Rooms allow broadcasting to specific conversations.

Room naming pattern

chat:<conversationId>

Example:

chat:698392c7bb978df8aa6ff979

Client joins room:

socket.emit("join_conversation", conversationId);

Server:

socket.on("join_conversation",(conversationId)=>{
  socket.join(`chat:${conversationId}`);
});
8. Sending Message (REST)

API:

POST /api/v1/messages

Controller:

1 create message
2 update conversation metadata
3 emit realtime event

Socket broadcast:

const io = getIO();

io.to(`chat:${conversationId}`).emit("new_message",{
  conversationId,
  message
});
9. Realtime Flow
User A sends message
        │
        ▼
POST /messages
        │
        ▼
Server saves message
        │
        ▼
Socket emits new_message
        │
        ▼
All users in room receive instantly
10. Socket Testing

Used socket.io-client.

Test script:

import { io } from "socket.io-client";

const socket = io("http://localhost:5000",{
  auth:{
    token: ACCESS_TOKEN
  }
});

socket.on("connect",()=>{
  socket.emit("join_conversation",conversationId);
});

socket.on("new_message",(data)=>{
  console.log(data);
});
11. Problems Encountered
JWT invalid signature

Cause:

token signed with different secret

Fix:

use accessToken from login API
ensure JWT_SECRET matches
Room mismatch

Problem:

chat:123
chat: 123

Spaces create different rooms.

Fix:

chat:${conversationId}
Testing WebSocket manually

Plain WebSocket tools don't support Socket.IO protocol.

Solution:

Use socket.io-client test script.

12. What Is Now Working

Backend now supports:

JWT socket authentication
conversation rooms
message persistence
realtime message broadcasting
REST + WebSocket architecture
13. Next Features To Implement
Presence system
user_online
user_offline
last_seen
Typing indicators
typing_start
typing_stop
Message states
sent
delivered
read
14. Key Concept
REST = store data
Sockets = distribute data

Both layers must work together.

15. Final Mental Model
Client
  │
  ├── REST → save message
  │
  └── Socket → realtime updates