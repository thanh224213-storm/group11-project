import React, { useState, useEffect } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://192.168.69.229:5000/users")
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi GET:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // Chạy 1 lần khi component mount

  return (
    <div>
      <h3>Danh sách người dùng:</h3>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} - {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;