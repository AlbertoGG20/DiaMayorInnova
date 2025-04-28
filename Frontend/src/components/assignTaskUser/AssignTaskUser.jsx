import userService from '../../services/userService';
import Modal from '../modal/Modal';
import ClassGroupService from '../../services/ClassGroupService';
import { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import "./AssignTaskUser.css"


const AssignTaskUser = ({ assignedInclude, setCurrentUsers, currentUsers }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [teacherClass, setTeacherClass] = useState([]);
  const [currentClass, setCurrentClass] = useState(0)

  const selectUser = (userId) => {
    if (!currentUsers.includes(userId))
      setCurrentUsers(prevState => [...prevState, userId]);
  }

  const deselectUser = (userId) => {
    setCurrentUsers(prevState => prevState.filter(id => id !== userId));
  }

  const checkboxActive = ({ target }, userId) => {
    const { checked } = target;
    if (checked) {
      selectUser(userId)
    } else {
      deselectUser(userId)
    }
  };

  const handleSelectClass = (e, id) => {
    e.preventDefault()
    setCurrentClass(id);
  }

  useEffect(() => {

    userService.getUserByClassId(currentClass)
      .then(({ data }) => {
        setUsers(data.data.data.users);
      });


    ClassGroupService.findByTeacherId(user.id)
      .then(({data}) => {
        setTeacherClass(data.data.class_groups);
      });
  }, [currentClass])

  return (
    <>
      <Modal
        btnText="Asignar Alumnos"
        modalTitle="Asignar tarea a usuario"
      >
        <div className='task-assigned__container'>
          <div className="list__container">
            <h3>Lista de clases</h3>
            <div className="list__items">
              {
                Array.isArray(teacherClass) && teacherClass.map((module) => (
                  <button className={(currentClass === module.id) ? "btn " : "btn light"} onClick={(e) => handleSelectClass(e, module.id)} key={`class_btn_${module.id}`}>{module.course_module}</button>
                ))
              }
            </div>
          </div>

          <div className="list__container">
            <h3>Lista de estudiantes</h3>
            <div className="list__items">
              {Array.isArray(users) ? users.map((user) => (
                <label className={assignedInclude(user.id) ? "user__item user__item--selected" : "user__item light"} key={user.id}>
                  <input
                    type="checkbox"
                    checked={assignedInclude(user.id)}
                    onChange={(event) => checkboxActive(event, user.id)}
                  />
                  {user.name} {user.first_lastName} {user.second_lastName}
                </label>
              )) :
                <p>Seleccione una clase para mostrar los Estudiantes</p>
              }
            </div>
          </div>
        </div>
        <button className='btn btn--tasks-assigned' onClick={(e) => e.preventDefault()}>Guardar asignación</button>
      </Modal>
    </>
  )
}

export default AssignTaskUser
