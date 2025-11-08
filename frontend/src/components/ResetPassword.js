import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './style.css';
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
      const res = await axios.post('http://localhost:5000/api/reset-password', { 
        token, 
        newPassword 
      });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi server');
    }
  };

  return (
    <div>
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
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Link to="/login" style={{ marginTop: '10px' }}>
        Quay lại Đăng nhập
      </Link>
    </div>
  );
};
export default ResetPassword;