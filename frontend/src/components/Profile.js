import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './style.css'; 
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Profile = () => {
  const { user: reduxUser } = useSelector(state => state.auth);
  // ... (các state khác) ...
  const [user, setUser] = useState({ email: "", role: "", avatar: "" });
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchUserData = async (token) => {
    try {
      // SỬA URL 1
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/profile`, {
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
      fetchUserData(token); 
    }
  }, [navigate]);

  const handleUpdateProfile = async () => {
    let token = localStorage.getItem("accessToken");
    try {
      // SỬA URL 2
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/auth/profile`,
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

  // ... (handleFileChange) ...
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadMessage('');
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) return;
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      // SỬA URL 3
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/upload-avatar`, 
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

  // ... (handleLogout và phần return giữ nguyên) ...
  // (Toàn bộ phần JSX giữ nguyên)
  const handleLogout = () => {
    dispatch(logout()); 
    navigate('/login'); 
  };
  const isAdmin = reduxUser && reduxUser.role === 'admin';

  return (
    <div className="profile-container">
      <h2>Thông Tin Cá Nhân</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
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
          {isEditing && isAdmin ? ( 
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
      {isAdmin && (
        <button onClick={() => navigate('/admin')} style={{ marginRight: '10px' }}>
          Quản lý Admin
        </button>
      )}
      <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
    </div>
  );
};

export default Profile;