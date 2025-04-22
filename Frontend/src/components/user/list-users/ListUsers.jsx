import React, { useEffect, useState } from "react";
import userService from "../../../services/userService";
import ConfirmDeleteModal from '../../modal/ConfirmDeleteModal';
import './ListUsers.css';

const ListUsers = ({ setSelectedUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await userService.getAllUsers(currentPage, 10);

        if (response) { 
          setUsers(response.data.data.users);
          setTotalPages(response.data.data.meta?.total_pages || 1);
        }
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers()
  }, [currentPage])

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

      <div className="user-list_pagination">
        <button className="dt-paging-button" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
          <i className='fi fi-rr-angle-double-small-left'/>
        </button>
        <button className="dt-paging-button" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
          <i className='fi fi-rr-angle-small-left'/>
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button className="dt-paging-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
          <i className='fi fi-rr-angle-small-right'/>
        </button>
        <button className="dt-paging-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
          <i className='fi fi-rr-angle-double-small-right'/>
        </button>
      </div>

        <ul className="user_list">
          <li className='user-list_item--header'>
            <div className="user-list_section">
              <p><strong>Nombre</strong></p>
              <p><strong>Correo</strong></p>
              <p><strong>Role</strong></p>
            </div>
          </li>
          {loading ? (
            <p>Cargando usuarios...</p>
          ) : (
            users.map(user => (
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
            ))
          )}
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