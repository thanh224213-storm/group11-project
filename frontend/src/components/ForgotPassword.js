feature/refresh-token
// ForgotPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import './style.css'; // Liên kết với file CSS

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
feature/refresh-token

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/forgot-password", { email });
      setMessage(response.data.message); // Hiển thị thông báo đã gửi email nếu có
    } catch (err) {
      setMessage(err.response?.data?.message || "Có lỗi xảy ra.");

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi server');

    }
  };

  return (
feature/refresh-token
    <div className="forgot-password-container">
  <h2>Quên Mật Khẩu</h2>
  <form onSubmit={handleSubmit}>
    <div>
      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
    </div>
    {message && <p>{message}</p>}
    <button type="submit">Gửi Email Đặt Lại Mật Khẩu</button>
  </form>
</div>

  );
};

export default ForgotPassword;

    <div>
      <h2>Quên Mật Khẩu</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Gửi link reset</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={() => navigate('/login')}>Quay lại Đăng nhập</button>
    </div>
  );
};
export default ForgotPassword;

