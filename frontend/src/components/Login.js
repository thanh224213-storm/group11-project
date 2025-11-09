import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './style.css';
import { useDispatch, useSelector } from 'react-redux'; // Import hook của Redux
import { loginUser } from '../features/auth/authSlice'; // Import thunk

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Lấy state (loading, error, user) từ store của Redux
  const { isLoading, error, user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Gọi Redux Thunk
    dispatch(loginUser({ email, password }))
      .unwrap() 
      .then((result) => {
        // Đăng nhập thành công, chuyển hướng dựa trên role
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/profile');
        }
      })
      .catch((err) => {
        // Lỗi (rejected), state 'error' đã tự động được cập nhật
        console.error('Đăng nhập thất bại:', err);
      });
  };

  // Tự động chuyển hướng nếu user đã đăng nhập
  useEffect(() => {
    if (user) {
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
        
        {/* Hiển thị lỗi từ Redux state (bao gồm lỗi 429) */}
        {error && <p className="error-message">{error}</p>}
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Đang tải...' : 'Đăng Nhập'}
        </button>
      </form>

      <div className="links">
        <p>Chưa có tài khoản? <a href="/signup">Đăng ký</a></p>
        <p><a href="/forgot-password">Quên mật khẩu?</a></p>
      </div>
    </div>
  );
};

export default Login;