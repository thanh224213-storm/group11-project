feature/refresh-token
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
      const response = await axios.post("http://localhost:5000/api/login", { email, password });
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      navigate('/profile');  // Chuyển hướng tới trang hồ sơ người dùng sau khi đăng nhập thành công
    } catch (err) {
      setErrorMessage("Sai email hoặc mật khẩu");
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
import React, { useState } from "react";
// 1. Import 'Link' (bạn đã có trong ảnh)
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  // ... (code state và handleLogin của bạn)

  return (
    // 2. Thêm thẻ <div> cha ở đây
    <div> 
      <div>
        <h2>Đăng Nhập</h2>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Mật khẩu" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button onClick={handleLogin}>Đăng Nhập</button>
      </div>
      
      {/* 3. Bây giờ 2 thẻ <p> này đã nằm bên trong <div> cha */}
      <p>Chưa có tài khoản? <Link to="/signup">Đăng ký.</Link></p>
      <p><Link to="/forgot-password">Quên mật khẩu?</Link></p>
      
    </div> // 4. Đóng thẻ <div> cha ở đây
  );
};

export default Login;

