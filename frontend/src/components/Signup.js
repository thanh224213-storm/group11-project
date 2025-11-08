import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './style.css';
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/signup", { email, password });
      navigate("/login");  // Chuyển hướng về trang login sau khi đăng ký thành công
    } catch (err) {
      setErrorMessage("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="form-container">
      <h2>Đăng Ký</h2>
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
        <div>
          <label>Xác nhận mật khẩu:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button type="submit">Đăng Ký</button>
      </form>

      <div className="links">
        <p>Đã có tài khoản? <a href="/login">Đăng nhập</a></p>
      </div>
    </div>
  );
};

export default Signup;
