import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css'; // Dùng chung file style

const AdminLogs = () => {
    // 1. Tạo state để lưu trữ logs và lỗi
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState('');

    // 2. Dùng useEffect để gọi API khi component được tải
    useEffect(() => {
        const fetchLogs = async () => {
            // 3. Lấy token của admin từ localStorage
            const token = localStorage.getItem('accessToken');
            
            if (!token) {
                setError('Bạn cần đăng nhập với quyền Admin.');
                return;
            }

            try {
                // 4. Gọi API (ĐÚNG THEO YÊU CẦU)
                // Nhớ đính kèm token vào header Authorization
                const res = await axios.get('http://localhost:5000/api/auth/logs', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // 5. Lưu dữ liệu vào state
                setLogs(res.data);
                
            } catch (err) {
                setError(err.response?.data?.message || 'Không thể tải log. Bạn có phải Admin?');
            }
        };

        fetchLogs();
    }, []); // Mảng rỗng [] nghĩa là chỉ chạy 1 lần khi component mount

    // Hàm helper để format ngày giờ cho đẹp
    const formatTimestamp = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleString('vi-VN'); // Format kiểu Việt Nam
    };

    return (
        <div className="admin-container">
            <h2>Lịch sử Hoạt động Người dùng</h2>
            
            {/* Hiển thị lỗi nếu có */}
            {error && <p className="error-message">{error}</p>}

            {/* 6. Hiển thị dữ liệu ra bảng */}
            <table>
                <thead>
                    <tr>
                        <th>Email Người dùng</th>
                        <th>Hành động</th>
                        <th>Thời gian</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Dùng .map() để lặp qua mảng logs */}
                    {logs.map((log) => (
                        <tr key={log._id}>
                            {/* API trả về log.user.email (vì ta dùng .populate())
                                Nếu user bị xóa, log.user có thể là null
                            */}
                            <td>{log.user ? log.user.email : '[Người dùng đã bị xóa]'}</td>
                            <td>{log.action}</td>
                            <td>{formatTimestamp(log.timestamp)}</td>
                        </tr>
                    ))}
                    
                    {/* Hiển thị nếu không có log */}
                    {logs.length === 0 && !error && (
                        <tr>
                            <td colSpan="3">Không có lịch sử hoạt động nào.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminLogs;