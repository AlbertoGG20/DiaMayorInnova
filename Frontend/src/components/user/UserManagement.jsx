import React, { useState } from "react";
import userService from "../../services/userService.js";
import AddUsers from "./add-users/AddUsers.jsx";
import ListUsers from "./list-users/ListUsers.jsx";
import "./UserManagement.css";

const UserManagement = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUserAdded = () => {
    // Forzar la recarga de la lista volviendo a la primera página
    setCurrentPage(1);
    // Incrementar el trigger para forzar la recarga
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="user_page">
      <AddUsers
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        onUserAdded={handleUserAdded}
      />
      <ListUsers
        setSelectedUser={setSelectedUser}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        setTotalPages={setTotalPages}
        search={search}
        setSearch={setSearch}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
};

export default UserManagement;