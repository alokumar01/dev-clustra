# DevClustra 🚀

> Real-time communication platform focused on backend architecture, real-time systems, containerized deployment, and DevOps workflows.

---

# 📖 Overview

DevClustra is a real-time chat and collaboration platform built to explore modern backend engineering, distributed systems, and DevOps workflows.

The project focuses on:

- Real-time communication using Socket.IO
- JWT authentication architecture
- Conversation-based messaging systems
- Dockerized full-stack workflows
- CI/CD integration using Jenkins
- Cloud-native deployment practices
- Scalable backend architecture

This project was designed to understand how modern communication systems work internally while integrating practical DevOps concepts used in production-grade environments.

---

# ✨ Features

## 🔐 Authentication & Security

- JWT Authentication
- Access & Refresh Token flow
- HTTP-only secure cookies
- Persistent login sessions
- Protected routes
- Secure password hashing using bcrypt

---

## 💬 Real-time Messaging

- One-to-one conversations
- Real-time message delivery
- Online/offline user presence
- Unread message tracking
- Read receipts
- Conversation-based chat architecture
- Socket rooms for real-time updates

---

## ☁️ Cloud Media Support

- Avatar uploads
- Cloudinary integration
- Secure media upload flow

---

# ⚡ Backend Architecture

Backend follows a modular architecture focused on scalability, maintainability, and separation of concerns.

Core architecture layers include:

- Controllers
- Services
- Middlewares
- Authentication Layer
- Conversation Layer
- Message Layer
- Socket Layer

---

# 🛠️ Tech Stack

## Frontend

- Next.js
- React
- Tailwind CSS
- shadcn/ui
- Socket.IO Client
- Zustand
- Axios

---

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Socket.IO
- JWT
- bcrypt
- Cloudinary

---

## DevOps & Cloud

- Docker
- Docker Compose
- Docker Hub
- Jenkins
- AWS EC2 (planned)
- Kubernetes (planned)
- Terraform (planned)
- Prometheus & Grafana (planned)

---

# 🐳 Containerization & DevOps

DevClustra is fully containerized using Docker to ensure consistent development and deployment workflows.

Implemented DevOps workflow includes:

- Frontend Dockerization
- Backend Dockerization
- Docker Compose orchestration
- Docker networking
- Environment management
- Docker Hub image registry
- CI/CD integration workflow

---

# 🏗️ Container Architecture

```txt
Browser
   ↓
Frontend Container (Next.js)
   ↓
REST APIs + Socket.IO
   ↓
Backend Container (Node.js + Express)
   ↓
MongoDB Atlas
```
---

# 🔄 CI/CD Workflow

Current CI/CD pipeline architecture:

```txt
GitHub Push
      ↓
Jenkins Pipeline
      ↓
Build Docker Images
      ↓
Push Images to Docker Hub
      ↓
Deployment Workflow
```

This workflow helps automate:

- Build processes
- Image generation
- Deployment consistency
- Environment reproducibility
- Scalable deployment practices

---

# 🏗️ Application Architecture

```txt
Frontend (Next.js)
        ↓
REST APIs + Socket.IO
        ↓
Backend (Node.js + Express)
        ↓
MongoDB Atlas
```

---

# 📂 Project Structure

```bash
dev-clustra/
│
├── client/
│   ├── app/
│   ├── components/
│   ├── store/
│   ├── services/
│   ├── lib/
│   ├── public/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.local
│   └── .env.docker
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   ├── conversation/
│   │   │   └── message/
│   │   ├── middlewares/
│   │   ├── helpers/
│   │   ├── routes/
│   │   ├── socket-server.js
│   │   └── app.js
│   │
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env
│   └── server.js
│
├── docker-compose.yml
└── README.md
```

---

# ⚙️ Environment Variables

## Frontend `.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

---

## Frontend `.env.docker`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

---

## Backend `.env`

```env
PORT=
MONGO_URI=

JWT_SECRET=
JWT_ACCESS_TOKEN_EXPIRES=
JWT_REFRESH_TOKEN_EXPIRES=

CLIENT_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RESEND_API_KEY=
```

---

# 🚀 Local Development Setup

## 1. Clone Repository

```bash
git clone https://github.com/alokumar01/dev-clustra.git
```

---

## 2. Install Dependencies

### Frontend

```bash
cd client
pnpm install
```

### Backend

```bash
cd backend
pnpm install
```

---

## 3. Run Development Servers

### Frontend

```bash
pnpm dev
```

### Backend

```bash
pnpm dev
```

---

# 🐳 Docker Setup

## Build & Run Containers

```bash
docker compose up --build
```

---

## Stop Containers

```bash
docker compose down
```

---

# 📦 Docker Hub Integration

Docker images are pushed to Docker Hub for deployment and CI/CD workflows.

Docker Hub repositories:

```txt
aalokumar01/dev-clustra-frontend
aalokumar01/dev-clustra-backend
```

Docker workflow:

```txt
Dockerfile
    ↓
Docker Build
    ↓
Docker Image
    ↓
Docker Hub Push
    ↓
Deployment Workflow
```

---

# ☁️ Deployment Roadmap

## Current

- Dockerized frontend & backend
- Docker Compose orchestration
- Docker networking
- Docker Hub workflow
- Jenkins CI/CD integration

---

## Planned

- AWS EC2 deployment
- Kubernetes orchestration
- Terraform infrastructure provisioning
- Monitoring using Prometheus & Grafana
- Redis integration

---

# 🧠 Engineering Concepts Explored

This project focuses heavily on understanding:

- Real-time system design
- WebSocket architecture
- JWT authentication flow
- Refresh token mechanisms
- Socket rooms & presence systems
- Containerized workflows
- Docker networking
- CI/CD pipelines
- Cloud deployment workflows
- Modular backend architecture
- Scalable infrastructure concepts

---

# 🎯 Learning Goals

DevClustra was built to explore practical software engineering concepts beyond traditional CRUD applications.

Primary focus areas include:

- Backend engineering
- Real-time communication systems
- DevOps workflows
- Container orchestration concepts
- Cloud deployment workflows
- Scalable architecture design

---

# 👨‍💻 Developer

## Alok Kumar

- Full Stack & DevOps Enthusiast
- Focused on Backend Engineering, Cloud, and Real-time Systems

### GitHub

```txt
https://github.com/alokumar01
```

### Portfolio

```txt
https://whoisalok.tech
```

### Project Repository

```txt
https://github.com/alokumar01/dev-clustra
```