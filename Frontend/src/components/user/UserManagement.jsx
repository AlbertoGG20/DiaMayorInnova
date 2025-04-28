import React, { useState, useEffect } from "react";
import userService from "../../services/userService.js";
import AddUsers from "./add-users/AddUsers.jsx";
import ListUsers from "./list-users/ListUsers.jsx";
import FindNameUsers from "./find-name-user/FindNameUsers.jsx";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    userService.getAllUsers()
      .then(({ data }) => {
        if (data.data && data.data.users) {
          setUsers(data.data.users);
        } else {
          console.error("No se encontraron usuarios en la respuesta.");
          setError("No se encontraron usuarios.");
        }
      })
      .catch(e => {
        console.error("Error fetching users", e);
        setError("Hubo un error al obtener los usuarios.");
      });
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="user_page">

      <AddUsers
        setUsers={setUsers}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
      <ListUsers
        users={filteredUsers}
        setUsers={setUsers}
        setSelectedUser={setSelectedUser}
      />
    </div>
  );
};

export default UserManagement;