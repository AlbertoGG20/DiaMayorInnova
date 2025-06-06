import React, { useState, useEffect } from "react";
import ClassGroupService from "../../services/ClassGroupService";
import userService from "../../services/userService";
import SchoolsServices from "../../services/SchoolsServices";
import ConfirmDeleteModal from "../modal/ConfirmDeleteModal";
import AssignUserToClass from "../assignUsersToClass/AssignUserToClass";
import { SearchBar } from "../search-bar/SearchBar";
import Table from "../table/Table";
import PaginationMenu from "../pagination-menu/PaginationMenu";

const ClassGroupsList = ({ refreshTrigger, onEdit, onStudentCountChange }) => {
  const [classGroups, setClassGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [teacherClassGroups, setTeacherClassGroups] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [schoolCenters, setSchoolCenters] = useState({});
  const itemsPerPage = 10;
  const [localPage, setLocalPage] = useState(1);
  const [allGroups, setAllGroups] = useState([]);

  const isSearching = searchTerm.trim().length > 0;

  const filteredGroups = isSearching
    ? classGroups.filter(group =>
      String(group.course || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(group.course_module || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(group.module_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(group.cycle || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(group.group_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(group.modality || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(group.location || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    : classGroups;

  const totalLocalPages = Math.ceil(filteredGroups.length / itemsPerPage);

  const fetchClassGroups = async (page, name) => {
    setLoading(true);
    try {
      const response = await ClassGroupService.getAll(page, itemsPerPage, name);
      if (response?.data?.data?.class_groups) {
        const groups = response?.data?.data?.class_groups;
        setClassGroups(groups);
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
    fetchClassGroups(currentPage, searchTerm);
    fetchCurrentUser();
  }, [refreshTrigger, currentPage, searchTerm]);

  const isButtonDisabled = (group) => {
    if (!currentUser) return true;
    if (currentUser.role === "admin" || currentUser.role === "center_admin") return false;
    if (currentUser.role === "teacher") {
      return !teacherClassGroups.includes(group.id);
    }
    return true;
  };

  const handleDeleteClick = (groupId) => {
    const group = classGroups.find(group => group.id === groupId);
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
      fetchClassGroups();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar el grupo de clase:", error);
    }
  };

  const handleEdit = (groupId) => {
    const group = classGroups.find(group => group.id === groupId);
    onEdit(group);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);

    if (!value) {
      fetchClassGroups();
      return;
    }

    setClassGroups((prevClassGroups) =>
      prevClassGroups.filter((classGroup) => {
        classGroup.course_module.toLowerCase().includes(value);
        setCurrentPage(1);
      })
    );
  };

  return (
    <div className="class-group-page__list">
      <div className="class-group-row">
        <h2>Lista de Grupos de Clase</h2>
      </div>

      <SearchBar
        value={searchTerm}
        handleSearchChange={handleSearchChange}
      />

      {filteredGroups.length === 0 ? (
        <p>No hay grupos de clase {searchTerm ? "que coincidan con la búsqueda" : "creados"}.</p>
      ) : (
        <div className="class-group-page__list-content">
          {
            loading ? (
              <p>Cargando grupos de clase...</p>
            ) : (
              <Table
                titles={["Curso", "Ciclo", "Grupo", "Cod. Módulo", "Nombre Módulo", "Modalidad", "Nº Estudiantes", "Máx. Estudiantes", "Aula", "Hrs/sem", "Centro", "Acciones"]}
                data={classGroups}
                actions={true}
                openModal={handleEdit}
                deleteItem={handleDeleteClick}
                columnConfig={[
                  { field: 'course', sortable: true },
                  { field: 'cycle', sortable: true },
                  { field: 'group_name', sortable: true },
                  { field: 'course_module', sortable: true },
                  { field: 'module_name', sortable: true },
                  { field: 'modality', sortable: true },
                  { field: 'number_students', sortable: true },
                  { field: 'max_students', sortable: true },
                  { field: 'location', sortable: true },
                  { field: 'weekly_hours', sortable: true },
                  { 
                    field: 'school_center',
                    sortable: true,
                    render: (row) => row.school_center?.code || ''
                  },
                ]}
                customActions={(row) => (
                  <AssignUserToClass
                    assignedInclude={(id) => (assignedUsers[row.id] || []).includes(id)}
                    setCurrentUsers={(newUsers) => setAssignedUsers(prev => ({
                      ...prev,
                      [row.id]: newUsers
                    }))}
                    currentUsers={assignedUsers[row.id] || []}
                    classGroupId={row.id}
                    onSave={handleSaveAssignment}
                    disabled={isButtonDisabled(row)}
                    onStudentCountChange={onStudentCountChange}
                    maxStudents={row.max_students}
                  />
                )}
              />
            )
          }

          <PaginationMenu
            currentPage={isSearching ? localPage : currentPage}
            setCurrentPage={isSearching ? setLocalPage : setCurrentPage}
            totalPages={isSearching ? totalLocalPages : totalPages}
          />
        </div>
      )}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="¿Estás seguro de eliminar este grupo de clase?"
        message={`El grupo de clase ${groupToDelete?.course}-${groupToDelete?.cycle}-${groupToDelete?.group_name} será eliminado permanentemente.`}
        onDelete={handleDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ClassGroupsList;
