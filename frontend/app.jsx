import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from './context/ThemeContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardOverview from './pages/admin/DashboardOverview';
import AdminStudents from './pages/admin/Students';
import AdminRooms from './pages/admin/Rooms';
import AdminComplaints from './pages/admin/Complaints';
import AdminLeaveRequests from './pages/admin/LeaveRequests';
import AdminNotices from './pages/admin/Notices';

// Student
import StudentLayout from './pages/student/StudentLayout';
import StudentDashboardOverview from './pages/student/DashboardOverview';
import StudentProfile from './pages/student/StudentProfile';
import StudentComplaints from './pages/student/Complaints';
import StudentLeaves from './pages/student/Leaves';
import StudentPayments from './pages/student/Payments';
import StudentNotices from './pages/student/Notices';
import StudentMessages from './pages/student/Messages';

import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

import 'react-toastify/dist/ReactToastify.css';

function App() {
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
            <Route path="messages" element={<StudentMessages />} />
          </Route>

          {/* Legacy redirect */}
          <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole={['admin', 'warden']}>
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
