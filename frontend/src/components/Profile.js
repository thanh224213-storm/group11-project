import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiRequest } from '../api';  // Đảm bảo bạn đã import apiRequest từ api.js
import './style.css'; // Liên kết với file CSS

const Profile = () => {
  const [user, setUser] = useState({ email: "", role: "", avatar: "" });
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const navigate = useNavigate();

  // Hàm gọi API để lấy thông tin người dùng
  const fetchUserData = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setEmail(response.data.email);
      setRole(response.data.role);
    } catch (err) {
      setErrorMessage("Không thể tải thông tin người dùng.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Vui lòng đăng nhập trước!");
      navigate("/login");
    } else {
      fetchUserData(token); // Gửi token vào yêu cầu API
    }
  }, [navigate]);

  const handleUpdateProfile = async () => {
    let token = localStorage.getItem("accessToken");
    try {
      const response = await axios.put(
        "http://localhost:5000/api/profile",
        { email, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(prevUser => ({ ...prevUser, email: email, role: role }));
      alert(response.data.message);
      setIsEditing(false);
    } catch (err) {
      alert("Cập nhật thất bại: " + err.message);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadMessage(''); // Reset upload message when file is selected
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) return;
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/upload-avatar", 
        formData, 
        { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` } }
      );
      setUploadMessage(res.data.message);
      setUser(prevUser => ({ ...prevUser, avatar: res.data.avatarUrl }));
      setSelectedFile(null);
    } catch (err) {
      setUploadMessage('Lỗi khi upload: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="profile-container">
      <h2>Thông Tin Cá Nhân</h2>
      {errorMessage && <div className="alert">{errorMessage}</div>}

      <div className="profile-avatar">
        {user.avatar && (
          <img src={user.avatar} alt="Avatar" />
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleAvatarUpload} disabled={!selectedFile}>Upload Avatar</button>
        {uploadMessage && <p>{uploadMessage}</p>}
      </div>

      <div className="profile-details">
        <div className="detail">
          <label>Email:</label>
          {isEditing ? (
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          ) : (
            <span>{user.email}</span>
          )}
        </div>

        <div className="detail">
          <label>Role:</label>
          {isEditing && user.role === 'admin' ? (  // Chỉ cho phép admin chỉnh sửa role
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
          ) : (
            <span>{user.role}</span>  // Nếu không phải admin, chỉ hiển thị role
          )}
        </div>
      </div>

      <button onClick={() => setIsEditing(!isEditing)} className="edit-btn">
        {isEditing ? "Hủy" : "Chỉnh sửa"}
      </button>
      {isEditing && (
        <button onClick={handleUpdateProfile}>Cập nhật</button>
      )}

      <hr />
      
      {/* Chỉ hiển thị nút "Quản lý Admin" nếu người dùng có role là admin */}
      {user.role === 'admin' && (
        <button onClick={() => navigate('/admin')} style={{ marginRight: '10px' }}>
          Quản lý Admin
        </button>
      )}

      <button onClick={() => navigate('/logout')} className="logout-btn">Đăng xuất</button>
    </div>
  );
};

export default Profile;
