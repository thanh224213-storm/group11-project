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
      // SỬA URL
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, { email, password });
      navigate("/login");  // Chuyển hướng về trang login sau khi đăng ký thành công
    } catch (err) {
      setErrorMessage("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="form-container">
      <h2>Đăng Ký</h2>
      <form onSubmit={handleSubmit}>
        {/* ... (phần input) ... */}
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