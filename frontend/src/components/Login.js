import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      navigate('/profile');  // Chuyển hướng tới trang hồ sơ người dùng sau khi đăng nhập thành công
    } catch (err) {
      // === (ĐÃ SỬA) ===
      // Đọc thông báo lỗi cụ thể từ server (bao gồm lỗi 429)
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else if (err.response) {
        // Lỗi server chung
        setErrorMessage("Sai email hoặc mật khẩu");
      } else {
        // Lỗi mạng (server sập)
        setErrorMessage("Không thể kết nối tới server.");
      }
      // === (HẾT SỬA) ===
    }
  };

  return (
    <div className="form-container">
      <h2>Đăng Nhập</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button type="submit">Đăng Nhập</button>
      </form>

      <div className="links">
        <p>Đã có tài khoản? <a href="/signup">Đăng ký</a></p>
        <p><a href="/forgot-password">Quên mật khẩu?</a></p>
      </div>
    </div>
  );
};

export default Login;