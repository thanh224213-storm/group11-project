import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css';
const Admin = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUsers = () => {
    const token = localStorage.getItem("accessToken"); // Đảm bảo sử dụng đúng accessToken
    if (!token) {
      alert("Bạn phải đăng nhập trước!");
      navigate("/login");
      return;
    }

    // Gửi yêu cầu GET để lấy danh sách người dùng, kèm theo Authorization header
    axios
      .get("http://localhost:5000/api/admin", {
        headers: { Authorization: `Bearer ${token}` }, // Gửi token vào header
      })
      .then((response) => {
        setUsers(response.data); // Lưu danh sách người dùng vào state
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
    fetchUsers(); // Gọi hàm fetchUsers để lấy danh sách người dùng khi component mount
  }, [navigate]);

  const handleDelete = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        const token = localStorage.getItem("accessToken"); // Đảm bảo sử dụng đúng accessToken
        await axios.delete(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Xóa người dùng thành công!");
        setUsers(users.filter(user => user._id !== userId)); // Cập nhật lại danh sách người dùng
      } catch (err) {
        alert("Xóa thất bại. " + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="container">
  <h2>Trang Quản Lý Admin</h2>
  {error && <div className="alert">{error}</div>}
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
            <button onClick={() => handleDelete(user._id)} style={{ color: 'red' }}>
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
