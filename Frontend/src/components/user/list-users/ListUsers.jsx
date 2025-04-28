import React, { useEffect, useState } from "react";
import userService from "../../../services/userService";
import ConfirmDeleteModal from '../../modal/ConfirmDeleteModal';
import './ListUsers.css';
import Table from "../../table/Table";
import { SearchBar } from "../../search-bar/SearchBar";
import PaginationMenu from "../../pagination-menu/PaginationMenu";
const ListUsers = ({ setSelectedUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 10;
  const [localPage, setLocalPage] = useState(1);

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

  const isSearching = search.trim().length > 0;

  const filteredUsers = isSearching
    ? users.filter(user =>
      String(user.name || "").toLowerCase().includes(search.toLowerCase()) ||
      String(user.email || "").toLowerCase().includes(search.toLowerCase()) ||
      String(user.role || "").toLowerCase().includes(search.toLowerCase())
    )
    : users;

  const totalLocalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  useEffect(() => {
    setLocalPage(1);
  }, [search]);

  const paginatedUsers = filteredUsers.slice(
    (isSearching ? (localPage - 1) : (currentPage - 1)) * itemsPerPage,
    (isSearching ? localPage : currentPage) * itemsPerPage
  );

  return (
    <>
      <section className='user-list__container'>
        <h2>Listada de Usuarios</h2>
        <SearchBar
          value={search}
          handleSearchChange={setSearch}
        />

        <Table
          titles={["Nombre", "Correo", "Role", "Acciones"]}
          data={paginatedUsers}
          actions={true}
          openModal={true}
          deleteItem={deleteUser}
          columnConfig={[
            { field: "name", sortable: true },
            { field: "email", sortable: true },
            { field: "role", sortable: true }
          ]}
        />

        <PaginationMenu
          currentPage={isSearching ? localPage : currentPage}
          setCurrentPage={isSearching ? setLocalPage : setCurrentPage}
          totalPages={isSearching ? totalLocalPages : totalPages}
        />
      </section >

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