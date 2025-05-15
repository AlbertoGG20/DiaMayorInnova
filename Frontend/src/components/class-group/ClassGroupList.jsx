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

  const fetchAllGroups = async () => {
    try {
      const response = await ClassGroupService.getAll({ per_page: 1000 }); // Pedimos un número grande para obtener todos
      if (response?.data?.data?.class_groups) {
        setAllGroups(response.data.data.class_groups);
      }
    } catch (error) {
      console.error("Error al obtener todos los grupos:", error);
    }
  };

  const fetchClassGroups = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        per_page: itemsPerPage
      };

      const response = await ClassGroupService.getAll(params);
      if (response?.data?.data?.class_groups) {
        const groups = response?.data?.data?.class_groups;
        setClassGroups(groups);
        setTotalPages(response?.data?.data?.meta?.total_pages || 1);
        if (currentPage > response?.data?.data?.meta?.total_pages) {
          setCurrentPage(1);
        }
      } else {
        console.error("No se recibieron datos válidos");
      }
    } catch (error) {
      console.error("Error al obtener los grupos de clase:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassGroups();
    if (isSearching) {
      fetchAllGroups();
    }
  }, [refreshTrigger, currentPage, isSearching]);

  useEffect(() => {
    fetchCurrentUser();
    fetchSchoolCenters();
  }, []);

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

  const fetchSchoolCenters = async () => {
    try {
      const response = await SchoolsServices.getAll();
      if (response && response.schools) {
        const centersMap = response.schools.reduce((acc, center) => {
          acc[center.id] = center.school_name;
          return acc;
        }, {});
        setSchoolCenters(centersMap);
      }
    } catch (error) {
      console.error("Error al obtener los centros escolares:", error);
    }
  };

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
      await fetchClassGroups();
    } catch (error) {
      console.error("Error actualizando usuarios:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await ClassGroupService.remove(groupToDelete.id);
      if (currentPage > 1 && classGroups.length === 1) {
        setCurrentPage(prev => prev - 1);
      }
      await fetchClassGroups();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar el grupo de clase:", error);
    }
  };

  const handleEdit = (groupId) => {
    const group = classGroups.find(group => group.id === groupId);
    onEdit(group);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim()) {
      fetchAllGroups();
    }
  };

  const filteredGroups = isSearching
    ? allGroups.filter(group =>
      String(group.course || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(group.course_module || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(group.modality || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(group.location || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    : classGroups;

  const totalLocalPages = Math.ceil(filteredGroups.length / itemsPerPage);

  useEffect(() => {
    setLocalPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (localPage > totalLocalPages) {
      setLocalPage(1);
    }
  }, [totalLocalPages, localPage]);

  const paginatedGroups = filteredGroups.slice(
    (localPage - 1) * itemsPerPage,
    localPage * itemsPerPage
  );

  return (
    <div className="class-group-page__list">
      <div className="class-group-row">
        <h2>Lista de Grupos de Clase</h2>
      </div>

      <SearchBar
        value={searchTerm}
        handleSearchChange={handleSearch}
      />

      {loading ? (
        <p>Cargando grupos de clase...</p>
      ) : filteredGroups.length === 0 ? (
        <p>No hay grupos de clase {searchTerm ? "que coincidan con la búsqueda" : "creados"}.</p>
      ) : (
        <div className="class-group-page__list-content">
          <Table
            titles={["Curso", "Módulo", "Modalidad", "Nº Estudiantes", "Máx. Estudiantes", "Aula", "Horas semanales", "Centro", "Acciones"]}
            data={paginatedGroups.map(group => ({
              ...group,
              school_center_id: schoolCenters[group.school_center_id] || 'Centro no encontrado'
            }))}
            actions={true}
            openModal={handleEdit}
            deleteItem={handleDeleteClick}
            columnConfig={[
              { field: 'course', sortable: true },
              { field: 'course_module', sortable: true },
              { field: 'modality', sortable: true },
              { field: 'number_students', sortable: true },
              { field: 'max_students', sortable: true },
              { field: 'location', sortable: true },
              { field: 'weekly_hours', sortable: true },
              { field: 'school_center_id', sortable: true },
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
        message={`El grupo de clase con curso ${groupToDelete?.course} y módulo ${groupToDelete?.course_module} será eliminado permanentemente.`}
        onDelete={handleDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ClassGroupsList;