import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ClassGroupDataService from "../../services/ClassGroupService";
import ClassGroupForm from "./ClassGroupForm";

const ClassGroup = () => {
  const { id } = useParams();
  let navigate = useNavigate();

  const initialClassGroupState = {
    id: null,
    course: 0,
    course_module: "",
    modality: "",
    number_students: 0,
    max_students: 0,
    location: "",
    weekly_hours: 0
  };
  const [currentClassGroup, setCurrentClassGroup] = useState(initialClassGroupState);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  const handleClick = () => {
    navigate("/class-list");
  }

  useEffect(() => {
    if (id) getClassGroup(id);
  }, [id]);

  const getClassGroup = id => {
    ClassGroupDataService.get(id)
      .then(response => {
        setCurrentClassGroup(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const handleInputChange = (updatedClassGroup) => {
    setCurrentClassGroup(updatedClassGroup);
  };

  const validateForm = () => {
    const course = Number(currentClassGroup.course);
    const number_students = Number(currentClassGroup.number_students);
    const max_students = Number(currentClassGroup.max_students);
    const weekly_hours = Number(currentClassGroup.weekly_hours);

    if (course <= 0 || !currentClassGroup.course_module || !currentClassGroup.modality ||
      number_students <= 0 || max_students <= 0 ||
      !currentClassGroup.location || weekly_hours <= 0) {
      setError("Todos los campos son obligatorios y deben tener valores válidos.");
      return false;
    }
    if (currentClassGroup.number_students > currentClassGroup.max_students) {
      setError("El número de estudiantes no puede ser mayor que el número máximo.");
      return false;
    }
    setError("");
    return true;
  };

  const updateClassGroup = () => {
    if (validateForm()) {
      ClassGroupDataService.update(currentClassGroup.id, currentClassGroup)
        .then(response => {
          setMessage("El grupo de clase fue actualizado correctamente.");
        })
        .catch(e => {
          setError("Hubo un problema al actualizar el grupo de clase.");
        });
    }
  };

  const deleteClassGroup = () => {
    ClassGroupDataService.remove(currentClassGroup.id)
      .then(response => {
        navigate("/class-list");
      }).catch(e => {
        console.log(e);
      });
  };

  return (
    <>
      {currentClassGroup ? (
        <div className="edit-form">
          <h4>Editor de Grupos de Clase</h4>
          <ClassGroupForm
            classGroup={currentClassGroup}
            onChange={handleInputChange}
            onSubmit={updateClassGroup}
            submitText="Modificar"
          />
          {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
          <button className="badge badge-danger mr-2" onClick={deleteClassGroup}>
            Borrar
          </button>
          <button className="badge badge-danger mr-2" onClick={handleClick}>
            Mostrar Lista
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Selecciona un módulo...</p>
        </div>
      )}
    </>
  );
};

export default ClassGroup;