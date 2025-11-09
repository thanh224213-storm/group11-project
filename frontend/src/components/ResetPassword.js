import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './style.css'; // Đã import style.css

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      // GỌI API (Đảm bảo URL này đúng với backend của bạn)
      const res = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { 
        newPassword 
      });
      setMessage(res.data.message);
      // Tùy chọn: Tự động chuyển về trang đăng nhập sau 3s
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi server');
    }
  };

  return (
    // 1. ÁP DỤNG .form-container
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

      {/* 2. ÁP DỤNG class cho message và error */}
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {/* 3. ÁP DỤNG .links cho Link */}
      <div className="links">
        <Link to="/login">
          Quay lại Đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;