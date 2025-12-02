# 🏨 UniStay - Modern Hostel Management System

<div align="center">

![UniStay Banner](https://img.shields.io/badge/UniStay-Hostel_Management-blue?style=for-the-badge&logo=homeassistant)
![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-ISC-yellow?style=for-the-badge)

<p align="center">
  <strong>A premium, full-stack solution for seamless hostel administration and student living.</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-api-documentation">API Routes</a> •
  <a href="#-getting-started">Getting Started</a>
</p>

</div>

---

## 📖 Overview

**UniStay** is a robust web application designed to bridge the gap between hostel administrators and students. It offers a dual-portal interface:
*   **Admin Portal:** For managing students, rooms, complaints, leaves, and notices with powerful analytics.
*   **Student Portal:** For students to view their profile, raise complaints, apply for leaves, and stay updated.

Built with a focus on **UI/UX excellence**, UniStay features a modern, responsive design with dark mode support, smooth animations, and secure role-based authentication.

---

## ✨ Features

### 🛡️ Admin Portal
*   **📊 Interactive Dashboard:** Real-time analytics with Recharts (Occupancy, Complaints, Revenue).
*   **👥 Student Management:** Add, update, and manage student profiles and room allocations.
*   **🛏️ Room Management:** Visual room status (Occupied, Vacant, Maintenance) and automated allocation logic.
*   **📢 Notice Board:** Post important announcements instantly to all students.
*   **📝 Request Handling:** Review and action student complaints and leave requests.
*   **🔐 Secure Auth:** JWT-based secure login with session management.

### 🎓 Student Portal
*   **🏠 Personal Dashboard:** Quick view of room details, attendance, and recent activity.
*   **⚠️ Complaint System:** File complaints with priority levels and track resolution status.
*   **📅 Leave Management:** Apply for leaves and view history/approval status.
*   **👤 Profile:** Manage personal details and view allocated amenities.
*   **🌙 Dark Mode:** Fully supported dark theme for late-night study sessions.

---

## 🛠 Tech Stack

### **Frontend**
| Technology | Description |
| :--- | :--- |
| ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) | **React 19** - Component-based UI library |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | **Vite** - Next-generation frontend tooling |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | **Tailwind CSS** - Utility-first CSS framework |
| ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white) | **Framer Motion** - Production-ready animation library |
| ![Lucide](https://img.shields.io/badge/Lucide_Icons-F7df1e?style=flat&logo=javascript&logoColor=black) | **Lucide React** - Beautiful & consistent icons |
| ![Recharts](https://img.shields.io/badge/Recharts-22b5bf?style=flat&logo=chartdotjs&logoColor=white) | **Recharts** - Composable charting library |

### **Backend**
| Technology | Description |
| :--- | :--- |
| ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white) | **Node.js** - JavaScript runtime environment |
| ![Express](https://img.shields.io/badge/Express.js-404D59?style=flat&logo=express&logoColor=white) | **Express** - Fast, unopinionated web framework |
| ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white) | **MongoDB** - NoSQL database for flexible data |
| ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat&logo=mongoose&logoColor=white) | **Mongoose** - Elegant MongoDB object modeling |
| ![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=json-web-tokens&logoColor=white) | **JSON Web Token** - Secure authentication |

---

## 🔌 API Documentation

### **Authentication**
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate user & get token | Public |

### **Students**
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/students` | Get all students (with pagination) | Admin |
| `POST` | `/api/students` | Add a new student | Admin |
| `PATCH` | `/api/students/:id` | Update student details | Admin |
| `DELETE` | `/api/students/:id` | Remove a student | Admin |

### **Complaints**
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/complaints` | Fetch complaints (User specific or All) | Auth |
| `POST` | `/api/complaints` | Submit a new complaint | Student |
| `PATCH` | `/api/complaints/:id` | Update complaint status | Admin |

### **Leaves**
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/leaves` | Fetch leave requests | Auth |
| `POST` | `/api/leaves` | Apply for leave | Student |
| `PATCH` | `/api/leaves/:id/status` | Approve/Reject leave | Admin |

### **Rooms**
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/rooms` | Get room status & details | Admin |
| `POST` | `/api/rooms` | Add/Configure rooms | Admin |

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas URI)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/unistay.git
    cd unistay
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    # Create .env file with:
    # PORT=8080
    # MONGODB_URI=your_mongodb_uri
    # JWT_SECRET=your_jwt_secret
    npm start
    ```

3.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Access the App**
    *   Frontend: `http://localhost:5173`
    *   Backend: `http://localhost:8080`

---

<div align="center">
  <p>Made with ❤️ by <strong>Lalith</strong></p>
  <p>
    <a href="https://github.com/Lalith0024">GitHub</a> •
    <a href="#">LinkedIn</a>
  </p>
</div>
