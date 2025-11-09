import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

// Thêm prop 'adminOnly' để kiểm tra quyền admin
const ProtectedRoute = ({ children, adminOnly = false }) => {
  // Lấy state 'auth' từ Redux store
  const { token, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // 1. Kiểm tra Token
  if (!token) {
    // Nếu chưa đăng nhập, đá về trang /login
    // 'replace state' để giữ lại trang user định đến
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2. Kiểm tra quyền Admin (nếu route yêu cầu)
  if (adminOnly && user?.role !== 'admin') {
    // Nếu yêu cầu admin mà user không phải, đá về trang /profile
    // (Hoặc bạn có thể tạo trang 403 Forbidden)
    return <Navigate to="/profile" replace />;
  }

  // Nếu vượt qua 2 vòng, cho phép render component con (children)
  return children;
};

export default ProtectedRoute;