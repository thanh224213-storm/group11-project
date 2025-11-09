import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { apiRequest } from '../api';  // (Code cũ của bạn)
import './style.css'; // Liên kết với file CSS

// (SV2) BƯỚC 1: IMPORT HOOKS VÀ ACTION TỪ REDUX
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Profile = () => {
  const [user, setUser] = useState({ email: "", role: "", avatar: "" });
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const navigate = useNavigate();

  // (SV2) BƯỚC 2: KHỞI TẠO DISPATCH
  const dispatch = useDispatch();

  // (Code cũ của bạn - Giữ nguyên)
  const fetchUserData = async (token) => {
    try {
feature/forgot-password
      const response = await axios.get("http://localhost:5000/api/auth/profile", {

      const response = await apiRequest({
        method: 'get',
        url: "http://localhost:5000/api/profile",

        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setEmail(response.data.email);
      setRole(response.data.role);
    } catch (err) {
      setErrorMessage("Không thể tải thông tin người dùng.");
    }
  };

  // (Code cũ của bạn - Giữ nguyên)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Vui lòng đăng nhập trước!");
      navigate("/login");
    } else {
      fetchUserData(token); 
    }
  }, [navigate]);

  // (Code cũ của bạn - Giữ nguyên)
  const handleUpdateProfile = async () => {
    let token = localStorage.getItem("accessToken");
    try {
feature/forgot-password
      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        { email, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const response = await apiRequest({
        method: 'put',
        url: "http://localhost:5000/api/profile",
        headers: { Authorization: `Bearer ${token}` },
        data: { email, role },
      });

      setUser(prevUser => ({ ...prevUser, email: email, role: role }));
      alert(response.data.message);
      setIsEditing(false);
    } catch (err) {
      alert("Cập nhật thất bại: " + err.message);
    }
  };

  // (Code cũ của bạn - Giữ nguyên)
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadMessage('');
  };

  // (Code cũ của bạn - Giữ nguyên)
  const handleAvatarUpload = async () => {
    if (!selectedFile) return;
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
 feature/forgot-password
      const res = await axios.post(
        "http://localhost:5000/api/auth/upload-avatar", 
        formData, 
        { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` } }
      );

      const res = await apiRequest({
        method: 'post',
        url: "http://localhost:5000/api/upload-avatar",
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        data: formData,
      });


      setUploadMessage(res.data.message);
      setUser(prevUser => ({ ...prevUser, avatar: res.data.avatarUrl }));
      setSelectedFile(null); // Clear file after successful upload
    } catch (err) {
      setUploadMessage('Lỗi khi upload: ' + (err.response?.data?.message || err.message));
    }
  };

  // (SV2) BƯỚC 3: TẠO HÀM LOGOUT
  const handleLogout = () => {
    dispatch(logout()); // Gọi action Redux để xóa state
    navigate('/login'); // Điều hướng về trang login
  };

  return (
    <div className="profile-container">
      {/* (Toàn bộ code JSX cũ của bạn được giữ nguyên) */}
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
        {/* ... (code hiển thị email, role) ... */}
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
          {isEditing && user.role === 'admin' ? (
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
          ) : (
            <span>{user.role}</span>
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
      
      {user.role === 'admin' && (
        <button onClick={() => navigate('/admin')} style={{ marginRight: '10px' }}>
          Quản lý Admin
        </button>
      )}

      {/* (SV2) BƯỚC 4: SỬA LẠI NÚT ĐĂNG XUẤT */}
      {/* Thay vì navigate('/logout'), ta gọi hàm handleLogout */}
      <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
    </div>
  );
};

export default Profile;