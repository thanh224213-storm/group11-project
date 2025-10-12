import React, { useEffect, useState } from "react";
import axios from "axios";
import AddUser from "./AddUser"; // 👈 import form thêm user

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const API_URL = "http://192.168.69.229:5000/users"; // ⚙️ Đổi IP nếu backend khác máy

  // 📥 Lấy danh sách user
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✏️ Bắt đầu sửa user
  const handleEdit = (user) => {
    setEditingUser(user._id || user.id); // hỗ trợ cả MongoDB hoặc mảng tạm
    setFormData({ name: user.name, email: user.email });
  };

  // 💾 Cập nhật user
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("⚠️ Tên không được để trống!");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return alert("⚠️ Email không hợp lệ!");

    try {
      await axios.put(`${API_URL}/${editingUser}`, formData);
      alert("✅ Cập nhật thành công!");
      setEditingUser(null);
      setFormData({ name: "", email: "" });
      fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật:", err);
      alert("Cập nhật thất bại!");
    }
  };

  // ❌ Xóa user
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này không?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("🗑️ Đã xóa user!");
      fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi xóa:", err);
      alert("Không thể xóa user!");
    }
  };

  return (
    <div style={styles.container}>
      <h2>👥 Danh sách người dùng</h2>

      {/* ✅ Form thêm user */}
      <AddUser onUserAdded={fetchUsers} />

      {/* ✅ Bảng danh sách */}
      {users.length === 0 ? (
        <p>Chưa có người dùng nào.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id || u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <button onClick={() => handleEdit(u)} style={styles.editBtn}>
                    ✏️ Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(u._id || u.id)}
                    style={styles.deleteBtn}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
        </table>
      )}

      {/* ✅ Form chỉnh sửa */}
      {editingUser && (
        <form onSubmit={handleUpdate} style={styles.editForm}>
          <h3>✏️ Chỉnh sửa người dùng</h3>
          <div style={{ marginBottom: "10px" }}>
            <label>Tên: </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Email: </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <button type="submit" style={styles.saveBtn}>
            💾 Lưu thay đổi
          </button>
          <button
            type="button"
            onClick={() => setEditingUser(null)}
            style={styles.cancelBtn}
          >
            ❌ Hủy
          </button>
        </form>
      )}
    </div>
  );
};

// 💅 CSS inline đơn giản
const styles = {
  container: {
    padding: "20px",
    fontFamily: "sans-serif",
  },
  table: {
    borderCollapse: "collapse",
    width: "100%",
    marginTop: "10px",
  },
  editBtn: {
    backgroundColor: "#4CAF50",
    color: "white",
    marginRight: "5px",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  deleteBtn: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  editForm: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    maxWidth: "400px",
  },
  saveBtn: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelBtn: {
    backgroundColor: "#ccc",
    color: "black",
    padding: "6px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "10px",
  },
};

export default UserList;