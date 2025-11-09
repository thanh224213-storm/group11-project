import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css'; // Dùng chung file style

const AdminLogs = () => {
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('Bạn cần đăng nhập với quyền Admin.');
                return;
            }
            try {
                // SỬA URL
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/logs`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setLogs(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Không thể tải log. Bạn có phải Admin?');
            }
        };
        fetchLogs();
    }, []); 

    // ... (phần formatTimestamp và return) ...
    // (Toàn bộ phần JSX giữ nguyên)
// ... (code còn lại)
    const formatTimestamp = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleString('vi-VN'); // Format kiểu Việt Nam
    };

    return (
        <div className="admin-container">
            <h2>Lịch sử Hoạt động Người dùng</h2>
            {error && <p className="error-message">{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Email Người dùng</th>
                        <th>Hành động</th>
                        <th>Thời gian</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log._id}>
                            <td>{log.user ? log.user.email : '[Người dùng đã bị xóa]'}</td>
                            <td>{log.action}</td>
                            <td>{formatTimestamp(log.timestamp)}</td>
                        </tr>
                    ))}
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