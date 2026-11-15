# DevClustra 🚀

> A real-time chat application for private conversations and temporary chat rooms, backed by a production deployment and monitoring workflow.

---

# 📖 Overview

DevClustra is a full-stack messaging application built with Next.js, Express, MongoDB, and Socket.IO. Users can create private conversations through invitations or join temporary chat sessions with a session code. The application is deployed on AWS EC2 with Kubernetes, and Jenkins automates backend checks and deployments.

🌐 **Live application:** [devclustra.aalokkumar.dev](https://devclustra.aalokkumar.dev)  
🩺 **API health:** [api.devclustra.aalokkumar.dev/health](https://api.devclustra.aalokkumar.dev/health)  
👨‍💻 **Portfolio:** [aalokkumar.dev](https://aalokkumar.dev)

---

# ✨ Features

## 🔐 Authentication & Security

- Account registration with email verification
- Login and logout with JWT access and refresh tokens
- HTTP-only cookies for authentication
- Password reset and password update flows
- Protected API routes and input validation

## 💬 Private Conversations

- Start a one-to-one conversation through a shareable invitation link
- Real-time message delivery with Socket.IO
- Online and offline presence indicators
- Typing indicators
- Unread message counts and read status
- Conversation history and profile editing

## ⚡ Temporary Chat Sessions

- Create and join temporary rooms using a session code
- Invite participants with a link
- Real-time messages and participant join/leave updates
- Close or leave a session

## ☁️ Media & Email

- Cloudinary-backed profile image uploads
- Resend-powered verification and password reset emails

---

# ⚡ Application Architecture

```text
Browser
   │
   ▼
Next.js frontend ── HTTP API / Socket.IO ──► Express backend
                                               │
                                               ├── MongoDB
                                               ├── Cloudinary
                                               └── Resend
```

The backend uses feature modules for authentication, users, conversations, messages, invitations, and temporary sessions. Express handles the REST API, while Socket.IO provides authenticated, real-time messaging and presence updates.

---

# 🛠️ Tech Stack

## Frontend

- Next.js and React
- Tailwind CSS and Radix UI
- Zustand for client state
- Axios for API requests
- Socket.IO Client for real-time updates

## Backend

- Node.js and Express
- MongoDB and Mongoose
- Socket.IO
- JWT and bcryptjs
- Zod validation
- Cloudinary and Resend integrations

## DevOps & Monitoring

- Docker and Docker Compose
- Jenkins CI/CD
- Docker Hub image registry
- AWS EC2
- Kubernetes for application workloads
- Terraform for AWS infrastructure
- Grafana dashboards
- Loki for log collection and exploration
- Node Exporter for host metrics

---

# 🐳 Containerization

The frontend and backend each have a Dockerfile. Docker Compose builds and runs both services for local use, and the backend image is published to Docker Hub for the Kubernetes deployment.

```text
Client Dockerfile ──► Frontend container
Backend Dockerfile ─► Backend image ─► Docker Hub ─► Kubernetes
```

---

# 🔄 CI/CD Workflow

Jenkins is live and runs the project's CI and deployment pipelines.

```text
GitHub push
    │
    ▼
Jenkins CI: install dependencies, lint backend, run backend tests, build frontend
    │
    ├── On main: build and push versioned backend image to Docker Hub
    │
    ▼
Jenkins CD: update Kubernetes backend deployment on AWS EC2
    │
    ▼
Wait for rollout, verify pods, check live API health endpoint
```

The frontend image publishing stages are currently disabled in `Jenkinsfile.ci`; the active image publishing and CD flow deploys the backend.

---

# ☁️ AWS, Kubernetes & Monitoring

The application runs on an AWS EC2 server in a Kubernetes environment. Jenkins connects to the EC2 host and updates the backend deployment when a new backend image is published.

The deployed monitoring stack includes:

- **Grafana** for dashboards and monitoring views
- **Loki** for centralized log collection and exploration
- **Node Exporter** for EC2 host metrics

Terraform configuration is in `infra/terraform`. It defines the EC2 instance, security group, and Elastic IP. The Terraform variables configure the AWS region, instance type, and instance name.

---

# 📂 Project Structure

```text
dev-clustra/
├── client/
│   ├── src/app/                 # Next.js pages and routes
│   ├── src/components/          # Chat, auth, session, and shared UI
│   ├── src/store/               # Zustand stores
│   ├── src/lib/                 # API client and utilities
│   ├── Dockerfile
│   └── .env                     # Local client environment (not committed)
├── backend/
│   ├── src/modules/
│   │   ├── auth/                 # Registration, login, verification, reset
│   │   ├── conversation/         # Private conversations and read status
│   │   ├── message/              # Message API and persistence
│   │   ├── invite/               # Conversation invitations
│   │   ├── user/                 # User profiles
│   │   ├── media/                # Upload handling
│   │   └── ehpemeralChat/session/ # Temporary chat sessions and sockets
│   ├── src/config/               # Database, CORS, email, and app config
│   ├── src/routes/               # Versioned API routes
│   ├── tests/                   # Backend tests
│   ├── Dockerfile
│   └── .env                     # Local backend environment (not committed)
├── infra/terraform/              # AWS EC2 infrastructure
├── Jenkinsfile.ci                # CI, backend image publishing, CD trigger
├── Jenkinsfile.cd                # Kubernetes deployment and health check
├── docker-compose.yml            # Local frontend and backend services
└── README.md
```

---

# ⚙️ Environment Variables

Create local environment files from these examples. Replace every placeholder with your own value, and do not commit secrets.

## Frontend — `client/.env`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

## Backend — `backend/.env`

```env
PORT=5000
NODE_ENV=development
MONGO_URI=<your_mongodb_connection_string>
FRONTEND_URL=http://localhost:3000
FRONTEND_LIVE_URL=http://localhost:3000
COOKIE_DOMAIN=
JWT_SECRET=<long_random_secret>
JWT_REFRESH_SECRET=<another_long_random_secret>
JWT_ACCESS_TOKEN_EXPIRES=15m
JWT_REFRESH_TOKEN_EXPIRES=7d
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
RESEND_API_KEY=<your_resend_api_key>
```

`CLOUDINARY_URL` is required when the backend starts. MongoDB, Cloudinary, and Resend credentials must be supplied by you. For production, set the frontend URLs and cookie domain to the deployed domains and use secure, unique secrets.

## Terraform — `infra/terraform/terraform.tfvars`

Terraform expects these input values. Keep the `.tfvars` file local; it is excluded from Git.

```hcl
aws_region    = "<aws-region>"
instance_type = "<ec2-instance-type>"
instance_name = "devclustra-server"
```

---

# 🚀 Local Development Setup

## 1. Clone the repository

```bash
git clone https://github.com/alokumar01/dev-clustra.git
cd dev-clustra
```

## 2. Install backend dependencies

```bash
cd backend
pnpm install
```

## 3. Install frontend dependencies

Open another terminal from the project root:

```bash
cd client
pnpm install
```

## 4. Start the services

Run in separate terminals:

```bash
# Terminal 1 — from backend/
pnpm dev
```

```bash
# Terminal 2 — from client/
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The backend health endpoint is [http://localhost:5000/health](http://localhost:5000/health).

---

# 🐳 Docker Compose Setup

Make sure `client/.env` and `backend/.env` are configured first, then run from the project root:

```bash
docker compose up --build
```

Stop the services with:

```bash
docker compose down
```

---

# 🧠 Engineering Concepts

- Real-time communication with authenticated Socket.IO connections
- JWT access and refresh token lifecycle
- Conversation membership checks and socket rooms
- Temporary room lifecycle and participant events
- Containerized development and deployment
- Jenkins CI/CD and Kubernetes rollout verification
- AWS infrastructure provisioning with Terraform
- Host metrics and centralized logs with Node Exporter, Grafana, and Loki

---

# 👨‍💻 Developer

## Alok Kumar

- Full-stack developer focused on backend engineering and DevOps

**Portfolio:** [aalokkumar.dev](https://aalokkumar.dev)  
**GitHub:** [github.com/alokumar01](https://github.com/alokumar01)  
**Project:** [github.com/alokumar01/dev-clustra](https://github.com/alokumar01/dev-clustra)
