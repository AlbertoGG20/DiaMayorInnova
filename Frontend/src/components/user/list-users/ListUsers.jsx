import React, { useState } from "react";
import userService from "../../../services/userService";
import ConfirmDeleteModal from '../../modal/ConfirmDeleteModal';
import './ListUsers.css';

const ListUsers = ({ users, setUsers, setSelectedUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const deleteUser = (userId) => {
    userService.deleteUser(userId)
      .then(() => {
        setUsers(prev => prev.filter(user => user.id !== userId));
        setIsModalOpen(false);
      })
      .catch(e => console.log(e));
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  return (
    <>
      <section className='user-list__container scroll-style'>
        <ul className="user_list">
          <li className='user-list_item--header'>
            <div className="user-list_section">
              <p><strong>Nombre</strong></p>
              <p><strong>Correo</strong></p>
              <p><strong>Role</strong></p>
            </div>
          </li>
          {users.map(user => (
            <li className='user-list_item' key={user.id}>
              <div className="user-list_section">
                <p>{user.name}</p>
                <p>({user.email})</p>
                <p>{user.role}</p>
              </div>
              <div className="user-list_section">
                <button className="edit-btn btn" onClick={() => setSelectedUser(user)} >Editar</button>
                <button className="delete-btn btn" onClick={() => handleDeleteClick(user)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        title="¿Estás seguro de que deseas eliminar este usuario?"
        message={`El usuario "${userToDelete?.name}" será eliminado permanentemente.`}
        onDelete={() => deleteUser(userToDelete.id)}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ListUsers;