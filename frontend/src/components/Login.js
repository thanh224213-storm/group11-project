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