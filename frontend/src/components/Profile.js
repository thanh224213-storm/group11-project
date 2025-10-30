// Profile.js
import React, { useState, useEffect } from "react";
// ... (các import khác)

const Profile = () => {
  const [user, setUser] = useState({ email: "", role: "", avatar: "" }); // Thêm avatar
  // ... (các state khác)
  const [selectedFile, setSelectedFile] = useState(null); // State cho file ảnh
  const [uploadMessage, setUploadMessage] = useState('');

  // ...
  // Trong hàm fetchUserData, đảm bảo bạn lấy cả avatar
  const fetchUserData = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data); // response.data nên có { email, role, avatar }
      setEmail(response.data.email);
      setRole(response.data.role);
    } catch (err) {
      // ...
    }
  };
  
  // ... (handleUpdateProfile giữ nguyên)

  // HÀM MỚI: Xử lý chọn file
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadMessage('');
  };

  // HÀM MỚI: Xử lý upload
  const handleAvatarUpload = async () => {
    if (!selectedFile) {
      setUploadMessage('Vui lòng chọn 1 file ảnh.');
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append('avatar', selectedFile); // 'avatar' phải khớp với API

    try {
      const res = await axios.post(
        "http://localhost:5000/api/upload-avatar", 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setUploadMessage(res.data.message);
      // Cập nhật avatar trên UI
      setUser(prevUser => ({ ...prevUser, avatar: res.data.avatarUrl }));
      setSelectedFile(null); // Xóa file đã chọn

    } catch (err) {
      setUploadMessage('Lỗi khi upload: ' + (err.response?.data?.message || err.message));
    }
  };


  return (
    <div>
      <h2>Welcome to the User Profile Page</h2>

      {/* ================================= */}
      {/* KHUNG AVATAR MỚI */}
      {/* ================================= */}
      <h3>Avatar</h3>
      {user.avatar && (
        <img 
          src={user.avatar} 
          alt="Avatar" 
          style={{ width: '150px', height: '150px', borderRadius: '50%' }} 
        />
      )}
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleAvatarUpload} disabled={!selectedFile}>
          Upload Avatar
        </button>
        {uploadMessage && <p>{uploadMessage}</p>}
      </div>
      <hr />
      {/* ================================= */}

      <h3>Thông Tin Cá Nhân</h3>
      {/* ... (code form chỉnh sửa email/role) ... */}
      
      <hr />
      {/* ... (code các nút Admin/Logout) ... */}
    </div>
  );
};

export default Profile;