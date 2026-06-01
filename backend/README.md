<div align="center">
  <h1>🏢 UniStay Hostel Management Backend</h1>
  <p>Production-grade Node.js/Express REST API serving the UniStay ecosystem.</p>
  
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
  [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
  [![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io)
</div>

<br />

## ✨ Features

- **🔐 Robust Auth System**: Secure authentication flows utilizing BCrypt password hashing & JWT tokens.
- **🏗 Industry-Standard Structure**: Highly decoupled, domain-driven `src/` modularization (Routes -> Controllers -> Services -> Models).
- **📝 Entity Management**: Full CRUD systems built for Students, Rooms, Notices, Complaints, and Leaves.
- **💳 Payments Ready**: Pre-configured support structure for Razorpay integrations.
- **☁️ Cloud-Native Deployment**: Exported handlers optimized for serverless deployments on Vercel and scalable hosting on Render.

---

## 📁 Architecture 

The codebase adheres strictly to the **MVC (Model-View-Controller)** pattern alongside designated middleware and configuration handlers to keep modules lightweight and isolated.

```text
/backend
├── 📂 src
│   ├── ⚙️ config/        # Environment & Database connection configuration
│   ├── 🎮 controllers/   # Core request handling and business logic
│   ├── 🛡️ middlewares/   # Route interceptors (Auth Gateways & Validation)
│   ├── 📊 models/        # Mongoose Data Schemas defining NoSQL structures
│   ├── 🚦 routes/        # Express routing mapping paths to controllers
│   ├── 🛠️ utils/         # Reusable helper objects and utilities
│   └── 🚀 index.js       # Main Application entry point & Express bootstrapping
├── 📜 package.json       # Project dependencies and script definitions
└── 🔒 .env               # Environment variable storage (gitignore'd)
```

---

## 🚀 Quick Start Guide

### 1. Requirements
- [Node.js](https://nodejs.org/) (v16.x or newer strongly recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas instance)

### 2. Installation
Clone this repository and ensure you are inside the backend directory. Then run:
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file at the root of the project to match the required secure keys:
```env
PORT=8080
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key
```

### 4. Running the Server

**For Local Development:**
Run the application with Nodemon to auto-restart on file changes:
```bash
npm run dev
```

**For Production:**
Run standard Node execution:
```bash
npm start
```
*(Server will verify MongoDB connection logs and run on `http://localhost:8080`)*

---

## 🔗 Core API Endpoints

### 🔑 Authentication
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/auth/signup` | Registers a new user. | ❌ |
| `POST` | `/auth/login` | Authenticates user & returns JWT. | ❌ |

### 🎓 Students
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/students` | Retrieves multiple students. | ✅ |
| `POST` | `/api/students` | Generates a new student profile. | ✅ |

### 🚪 Rooms
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/rooms` | Retrieves all hostel rooms. | ✅ |

> **Note:** Additional endpoints perfectly mirror this convention for `/api/complaints`, `/api/leaves`, and `/api/notices`.

---

## 🤝 Contribution Guidelines
This heavily standardized REST API expects contributions to follow its modular setup. Always ensure:
1. Business logic remains entirely inside `src/controllers/`.
2. Database structures do not leak outside `src/models/`.
3. Routes only map requests, avoiding in-line processing inside `src/routes/`.

<div align="center">
  <sub>Built with ❤️ for standardizing modern Hostel Infrastructure.</sub>
</div>
