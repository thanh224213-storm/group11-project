import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);

  // Hàm lấy danh sách user từ backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://192.168.69.229:5000/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi GET:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h3>Danh sách người dùng</h3>
      <ul>
        {users.map((u) => (
          <li key={u._id}>
            {u.name} - {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;