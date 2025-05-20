import { useEffect, useState, useRef } from "react";
import userService from "../../services/userService";
import Modal from "../modal/Modal";
import ClassGroupService from "../../services/ClassGroupService";
import { useAuth } from "../../context/AuthContext";
import "./AssignUserToClass.css"

const AssignUserToClass = ({
  setCurrentUsers,
  currentUsers,
  classGroupId,
  onSave,
  disabled,
}) => {
  const { user } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(currentUsers || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  const groupedUsers = (Array.isArray(allUsers) ? allUsers : []).reduce((acc, user) => {
    const role = user.role;
    if (!acc[role]) acc[role] = [];
    acc[role].push(user);
    return acc;
  }, {});


  const rolesOrder = ['teacher', 'student'];

  const toggleUser = (userId) => {
    setSelectedUsers(prev => {
      const newSelected = prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId];
      return newSelected;
    });
  };

  useEffect(() => {
    if (!isModalOpen) {
      setSelectedUsers(currentUsers || []);
    }
  }, [currentUsers, isModalOpen]);

  useEffect(() => {
    const loadAssignedStudents = async () => {
      try {
        const response = await ClassGroupService.getClassGroupUsers(classGroupId);
        setAssignedStudents(response.data.data.users.map(u => u.id));
      } catch (error) {
        console.error("Error cargando estudiantes asignados:", error);
      }
    };

    if (classGroupId) loadAssignedStudents();
  }, [classGroupId]);

  useEffect(() => {
    setCurrentUsers([...new Set([...(currentUsers || []), ...assignedStudents])]);
  }, [assignedStudents]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        let schoolCenterId;
        let usersResponse;

        if (user.role === 'admin' && classGroupId) {
          const classGroupResponse = await ClassGroupService.get(classGroupId);
          schoolCenterId = classGroupResponse.data.school_center_id;

          usersResponse = await userService.getUsersBySchoolCenter(schoolCenterId);
        } else {
          usersResponse = await userService.getAllUsers();
        }

        // When current user's role is 'admin', the response is coming in extra nested
        // data object. We need to handle that case.
        // This is a temporary fix until we can refactor the backend to return consistent data.
        const users = usersResponse?.data?.data?.data?.users || usersResponse?.data?.data?.users || usersResponse?.data?.users || [];
        console.log(schoolCenterId,users)
        setAllUsers(users);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    if (classGroupId) loadData();
  }, [user, classGroupId]);

  return (
    <Modal
      ref={modalRef}
      btnText={<i className='fi fi-rr-user-add' />}
      modalTitle="Asignar usuarios al grupo"
      showButton={true}
      needOpen={!disabled}
      onOpen={() => setIsModalOpen(true)}
      onClose={() => setIsModalOpen(false)}
      btnNoBg={true}
    >
      <div className='task-assigned__container'>
        <div className="list__container">
          <h3>Lista de Usuarios</h3>
          <div className="list__items">
            {loading ? (
              <div>Cargando usuarios...</div>
            ) : (
              (user.role === 'admin' || user.role === 'center_admin') ? (
                rolesOrder.map(role => {
                  if (!groupedUsers[role]) return null;
                  return (
                    <div key={role} className="role-group">
                      <h4 className="role-header">
                        {role === 'teacher' ? 'Profesores' :
                          role === 'student' ? 'Estudiantes' :
                            role}
                      </h4>
                      {groupedUsers[role].map(user => (
                        <label
                          key={user.id}
                          className={`user__item ${selectedUsers.includes(user.id)
                            ? "user__item--selected"
                            : "light"
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUser(user.id)}
                          />
                          {user.name} {user.first_lastName} {user.second_lastName}
                        </label>
                      ))}
                    </div>
                  );
                })
              ) : (
                allUsers.map(user => (
                  <label
                    key={user.id}
                    className={`user__item ${selectedUsers.includes(user.id)
                      ? "user__item--selected"
                      : "light"
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUser(user.id)}
                    />
                    {user.name} {user.first_lastName} {user.second_lastName}
                  </label>
                ))
              )
            )}
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button
          className="btn btn--tasks-assigned"
          onClick={() => {
            onSave(classGroupId, selectedUsers);
            modalRef.current?.close();
          }}
        >
          Guardar
        </button>
        <button className="btn light" onClick={() => { onSave(classGroupId, selectedUsers); }}>
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

export default AssignUserToClass;