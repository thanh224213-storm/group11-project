import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Cần cài: npm install jwt-decode

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        // Không có token, chuyển về trang Đăng nhập
        return <Navigate to="/login" />;
    }

    try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;

        if (userRole === 'admin') {
            // Nếu là admin, cho phép truy cập
            return children;
        } else {
            // Không phải admin, đá về trang Profile
            return <Navigate to="/profile" />;
        }
    } catch (error) {
        // Token lỗi/hết hạn
        console.error("Token không hợp lệ:", error);
        return <Navigate to="/login" />;
    }
};

export default AdminRoute;