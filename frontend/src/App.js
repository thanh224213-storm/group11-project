feature/refresh-token
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Admin from "./components/Admin";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import AdminLogs from './components/AdminLogs';

// Import ProtectedRoute (từ Hoạt động 6)
// (Bạn không cần AdminRoute.js nữa)
import ProtectedRoute from "./components/ProtectedRoute"; 

const App = () => {
  return (
    <Router>
      <Routes>
        {/* === CÁC ROUTE CÔNG KHAI === */}
        {/* Route mặc định chuyển về login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Route Đăng Nhập */}
        <Route path="/login" element={<Login />} />

        {/* Route Đăng Ký */}
        <Route path="/signup" element={<Signup />} />

        {/* Route Quên Mật Khẩu */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Route Reset Mật Khẩu */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        
        {/* === CÁC ROUTE ĐƯỢC BẢO VỆ (Hoạt động 6) === */}

        {/* Route Hồ Sơ Người Dùng (Chỉ cần đăng nhập) */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        {/* Route Quản lý Admin (Yêu cầu admin) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly={true}>
              <Admin />
            </ProtectedRoute>
          } 
        />

        {/* Route xem Logs (Yêu cầu admin) */}
        <Route 
          path="/admin/logs" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLogs />
            </ProtectedRoute>
          } 
        />

        {/* Lưu ý: Route "/logout" đã bị xóa
          Vì giờ bạn sẽ dùng Redux:
          Tạo một nút bấm trong Profile.js và gọi dispatch(logout())
        */}

      </Routes>
    </Router>
  );
};

 feature/forgot-password
export default App;

export default App;


import { Router } from "express";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

<Routes>
    <Route path="/admin" element={<Admin />} />
    <Route path="/logout" element={<Logout />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset/:token" element={<ResetPassword />} />
  </Routes>

