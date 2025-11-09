import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Admin from "./components/Admin";
import Logout from "./components/Logout";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import AdminLogs from './components/AdminLogs'; // <-- Import component mới
import AdminRoute from './components/AdminRoute'; // <-- Import route bảo vệ
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route mặc định chuyển về login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Route Đăng Nhập */}
        <Route path="/login" element={<Login />} />

        {/* Route Đăng Ký */}
        <Route path="/signup" element={<Signup />} />

        {/* Route Hồ Sơ Người Dùng */}
        <Route path="/profile" element={<Profile />} />

        {/* Route Quản lý Admin */}
        <Route path="/admin" element={<Admin />} />

        {/* Route Đăng Xuất */}
        <Route path="/logout" element={<Logout />} />

        {/* Route Quên Mật Khẩu */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Route Reset Mật Khẩu (SỬA DÒNG NÀY) */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Route Quản lý Admin (cũ) */}
        <Route path="/admin" element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        } />

        {/* (SV2) THÊM ROUTE MỚI CHO LOGS */}
        <Route path="/admin/logs" element={
          <AdminRoute>
            <AdminLogs />
          </AdminRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;