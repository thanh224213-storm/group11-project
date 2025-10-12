import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);

  // Hàm lấy danh sách user từ backend
  const fetchUsers = async () => {
    try {
      // 👉 IP là máy backend (đổi đúng IP của bạn backend)
      const res = await axios.get("http://192.168.69.229:5000/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách:", err);
    }
  };

  // Gọi khi component vừa render
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h3>Danh sách người dùng</h3>
      {users.length === 0 ? (
        <p>Chưa có người dùng nào.</p>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u._id || u.id}>
              {u.name} - {u.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;