feature/redux-protected
import React, { useState, useEffect } from 'react';
// KHÔNG CẦN 'axios' nữa, vì Redux Thunk (authSlice) sẽ quản lý
// import axios from 'axios'; 

feature/refresh-token
import React, { useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import './style.css';
import { useDispatch, useSelector } from 'react-redux'; // Import hook của Redux
import { loginUser } from '../features/auth/authSlice'; // Import thunk

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // KHÔNG DÙNG 'errorMessage' state riêng lẻ nữa, ta sẽ lấy từ Redux
  // const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();
  
  // (SV2) SỬ DỤNG REDUX HOOKS
  const dispatch = useDispatch();
  
  // Lấy state (loading, error, user) từ store của Redux
  const { isLoading, error, user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // (SV2) GỌI REDUX THUNK
    // Thay vì dùng axios, ta dispatch action 'loginUser'
    dispatch(loginUser({ email, password }))
      .unwrap() // .unwrap() giúp bắt lỗi từ createAsyncThunk
      .then((result) => {
        // Đăng nhập thành công, 'result' là payload (user, token)
        // Ta sẽ chuyển hướng dựa trên role
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/profile');
        }
      })
      .catch((err) => {
        // Lỗi (rejected)
        // 'err' là payload lỗi (message) từ 'rejectWithValue'
        // State 'error' của Redux đã tự động được cập nhật
        console.error('Đăng nhập thất bại:', err);
      });
  };

  // (SV2) TỰ ĐỘNG CHUYỂN HƯỚNG
  // Hook này sẽ chạy khi state 'user' (từ Redux) thay đổi
  useEffect(() => {
    if (user) {
      // Nếu user đã đăng nhập, chuyển hướng họ
      navigate(user.role === 'admin' ? '/admin' : '/profile');
    }
  }, [user, navigate]);


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
        
        {/* (SV2) HIỂN THỊ LỖI TỪ REDUX STATE */}
        {/* 'error' này chính là message (bao gồm cả lỗi 429) */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {/* (SV2) VÔ HIỆU HÓA NÚT KHI ĐANG TẢI */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Đang tải...' : 'Đăng Nhập'}
        </button>
      </form>

      <div className="links">
        <p>Đã có tài khoản? <a href="/signup">Đăng ký</a></p>
        <p><a href="/forgot-password">Quên mật khẩu?</a></p>
      </div>
    </div>
  );
};
 feature/log-rate-limit
export default Login;

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

