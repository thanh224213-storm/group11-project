import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './style.css';
const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  }, [navigate]);

  return <div>Đang đăng xuất...</div>;
};

export default Logout;