import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from './context/ThemeContext';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/register" element={<Navigate to="/signup" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
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
