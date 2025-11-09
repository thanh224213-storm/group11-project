import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './style.css'; 

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // ... (các state khác) ...
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu không khớp!');
      return;
    }
    setError('');
    setMessage('');

    try {
      // SỬA URL
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/reset-password/${token}`, { 
        newPassword 
      });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi server');
    }
  };

  return (
    // ... (phần return JSX giữ nguyên) ...
    <div className="form-container">
      <h2>Đặt Lại Mật Khẩu Mới</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Xác nhận mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Đặt lại mật khẩu</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="links">
        <Link to="/login">
          Quay lại Đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;