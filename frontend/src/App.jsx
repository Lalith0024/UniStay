import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboardOverview from "./pages/admin/DashboardOverview.jsx";
import AdminStudents from "./pages/admin/Students.jsx";
import AdminRooms from "./pages/admin/Rooms.jsx";
import AdminComplaints from "./pages/admin/Complaints.jsx";
import AdminLeaveRequests from "./pages/admin/LeaveRequests.jsx";
import AdminNotices from "./pages/admin/Notices.jsx";

// Student pages
import StudentLayout from "./pages/student/StudentLayout.jsx";
import StudentDashboardOverview from "./pages/student/DashboardOverview.jsx";
import StudentProfile from "./pages/student/StudentProfile.jsx";
import StudentComplaints from "./pages/student/Complaints.jsx";
import StudentLeaves from "./pages/student/Leaves.jsx";
import StudentNotices from "./pages/student/Notices.jsx";
import StudentPayments from "./pages/student/Payments.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";

import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext.jsx";

import "react-toastify/dist/ReactToastify.css";


import config from "./config";

function App() {
  React.useEffect(() => {
    // Warm up the server
    fetch(`${config.API_URL}/ping`).catch(() => { });
  }, []);

  return (
    <ThemeProvider>
      <div className="App">

        <Routes>

          {/* Public */}
          <Route path="/" element={<Landing />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Student */}
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboardOverview />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="complaints" element={<StudentComplaints />} />
            <Route path="leaves" element={<StudentLeaves />} />
            <Route path="payments" element={<StudentPayments />} />
            <Route path="notices" element={<StudentNotices />} />
          </Route>

          {/* Legacy redirect */}
          <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole={["admin", "warden"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardOverview />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="rooms" element={<AdminRooms />} />
            <Route path="complaints" element={<AdminComplaints />} />
            <Route path="leaves" element={<AdminLeaveRequests />} />
            <Route path="notices" element={<AdminNotices />} />
          </Route>

          {/* Redirects */}
          <Route path="/register" element={<Navigate to="/signup" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />

      </div>
    </ThemeProvider>
  );
}

export default App;
