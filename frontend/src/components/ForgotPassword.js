import React, { useState } from 'react';
import axios from 'axios';
import './style.css'; // Liên kết với file CSS

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage(response.data.message); // Hiển thị thông báo đã gửi email nếu có
    } catch (err) {
      setMessage(err.response?.data?.message || "Có lỗi xảy ra.");
    }
  };

  return (
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
