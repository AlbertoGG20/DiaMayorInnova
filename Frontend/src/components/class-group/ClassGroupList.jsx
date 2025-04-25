import React, { useState, useEffect } from "react";
import ClassGroupService from "../../services/ClassGroupService";
import userService from "../../services/userService";
import ConfirmDeleteModal from "../modal/ConfirmDeleteModal";
import AssignUserToClass from "../assignUsersToClass/AssignUserToClass";
import { SearchBar } from "../search-bar/SearchBar";

const ClassGroupsList = ({ refreshTrigger, onEdit, onStudentCountChange, maxStudents }) => {
  const [classGroups, setClassGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [teacherClassGroups, setTeacherClassGroups] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchClassGroups = async () => {
    setLoading(true);
    try {
      const response = await ClassGroupService.getAll();
      if (response?.data?.data?.class_groups) {
        setClassGroups(response?.data?.data?.class_groups);
        setTotalPages(response?.data?.data?.meta?.total_pages || 1);
      } else {
        console.error("No se recibieron datos válidos");
      }
    } catch (error) {
      console.error("Error al obtener los grupos de clase:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const user = await userService.getCurrentUser();
      setCurrentUser(user);
      if (user.role === "teacher") {
        const teacherGroups = await userService.getTeacherClassGroups(user.id);
        setTeacherClassGroups(teacherGroups.map(group => group.class_group_id));
      }
    } catch (error) {
      console.error("Error al obtener el usuario actual:", error);
    }
  };

  useEffect(() => {
    fetchClassGroups();
    fetchCurrentUser();
  }, [refreshTrigger, currentPage]);

  const isButtonDisabled = (group) => {
    if (!currentUser) return true;
    if (currentUser.role === "admin" || currentUser.role === "center_admin") return false;
    if (currentUser.role === "teacher") {
      return !teacherClassGroups.includes(group.id);
    }
    return true;
  };

  const handleAssignUsers = (group) => {
    userService.getUserByClassId(group.id)
      .then(({ data }) => {
        setAssignedUsers(prev => ({
          ...prev,
          [group.id]: data.data.users.map(user => user.id)
        }));
      });
  };

  const handleDeleteClick = (group) => {
    setGroupToDelete(group);
    setIsDeleteModalOpen(true);
  };

  const handleSaveAssignment = async (classGroupId, userIds) => {
    try {
      await ClassGroupService.updateClassGroupUsers(classGroupId, { users: userIds });
      setAssignedUsers(prev => ({
        ...prev,
        [classGroupId]: userIds
      }));
      fetchClassGroups();
    } catch (error) {
      console.error("Error actualizando usuarios:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await ClassGroupService.remove(groupToDelete.id);
      // Después de eliminar, refrescamos la lista
      fetchClassGroups();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar el grupo de clase:", error);
    }
  };

  if (loading) {
    return <div>Cargando grupos de clase...</div>;
  }

  return (
    <div className="class-group-page__list">
      <div className="class-group-row">
        <h2>Lista de Grupos de Clase</h2>
      </div>

      <SearchBar
        value={null}
        handleSearchChange={null}
      />

      {classGroups.length === 0 ? (
        <p>No hay grupos de clase creados.</p>
      ) : (
        <div className="class-group-page__list-content">
          <ul>
            <li className="class-group-page-item header">
              <div className="class-group-page_section">
                <p><strong>Curso</strong></p>
                <p><strong>Módulo</strong></p>
                <p><strong>Modalidad</strong></p>
                <p><strong>Nº Estudiantes</strong></p>
                <p><strong>Máx. Estudiantes</strong></p>
                <p><strong>Aula</strong></p>
                <p><strong>Horas semanales</strong></p>
                <p><strong>Centro</strong></p>
              </div>
              <div className="class-group-page_section">
                <p><strong>Acciones</strong></p>
              </div>
            </li>
            {classGroups.map((group) => (
              <li key={group.id} className="class-group-page-item">
                <div className="class-group-page_section">
                  <p> {group.course}</p>
                  <p> {group.course_module}</p>
                  <p> {group.modality}</p>
                  <p> {group.number_students}</p>
                  <p> {group.max_students}</p>
                  <p> {group.location}</p>
                  <p> {group.weekly_hours}</p>
                  <p> {group.school_center_id}</p>
                </div>
                <div className="class-group-page_section">
                  <AssignUserToClass
                    assignedInclude={(id) => (assignedUsers[group.id] || []).includes(id)}
                    setCurrentUsers={(newUsers) => setAssignedUsers(prev => ({
                      ...prev,
                      [group.id]: newUsers
                    }))}
                    currentUsers={assignedUsers[group.id] || []}
                    classGroupId={group.id}
                    onSave={handleSaveAssignment}
                    disabled={isButtonDisabled(group)}
                    onStudentCountChange={onStudentCountChange}
                    maxStudents={group.max_students}
                  />
                  <button
                    className=" btn btn__icon"
                    onClick={() => onEdit(group)}
                    disabled={isButtonDisabled(group)}
                  >
                    <i className='fi fi-rr-pencil' />
                  </button>
                  <button
                    className="btn btn__icon"
                    onClick={() => handleDeleteClick(group)}
                    disabled={isButtonDisabled(group)}
                  >
                    <i className='fi fi-rr-trash' />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="section-table__pagination">
            <button className="dt-paging-button" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
              <i className='fi fi-rr-angle-double-small-left' />
            </button>
            <button className="dt-paging-button" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
              <i className='fi fi-rr-angle-small-left' />
            </button>
            <span>Página {currentPage} de {totalPages}</span>
            <button className="dt-paging-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
              <i className='fi fi-rr-angle-small-right' />
            </button>
            <button className="dt-paging-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
              <i className='fi fi-rr-angle-double-small-right' />
            </button>
          </div>
        </div>
      )}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="¿Estás seguro de eliminar este grupo de clase?"
        message={`El grupo de clase con curso ${groupToDelete?.course} y módulo ${groupToDelete?.course_module} será eliminado permanentemente.`}
        onDelete={handleDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ClassGroupsList;