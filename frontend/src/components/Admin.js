import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { Link } from 'react-router-dom'; 

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUsers = () => {
    const token = localStorage.getItem("accessToken"); 
    if (!token) {
      alert("Bạn phải đăng nhập trước!");
      navigate("/login");
      return;
    }

    // SỬA URL 1
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/auth/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          setError("Bạn không có quyền truy cập vào trang này.");
        } else {
          setError("Lỗi khi lấy danh sách người dùng.");
        }
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [navigate]);

  const handleDelete = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        const token = localStorage.getItem("accessToken");
        // SỬA URL 2
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/auth/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Xóa người dùng thành công!");
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        alert("Xóa thất bại. " + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    // ... (phần return JSX giữ nguyên) ...
    <div className="admin-container"> 
      <h2>Trang Quản Lý Admin</h2>
      {error && <div className="alert">{error}</div>}
      <div className="admin-navigation" style={{ marginBottom: '20px' }}>
        <Link to="/admin/logs">
          <button className="edit-btn">Xem Lịch sử Hoạt động (Logs)</button>
        </Link>
      </div>
      <h3>Danh sách Người dùng</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleDelete(user._id)} className="logout-btn">
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;