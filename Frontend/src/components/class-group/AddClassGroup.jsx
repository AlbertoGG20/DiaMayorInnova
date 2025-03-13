import React, { useState } from "react";
import ClassGroupDataService from "../../services/ClassGroupService";
import { useNavigate } from "react-router-dom";
import ClassGroupForm from "./ClassGroupForm";

const AddClassGroup = () => {
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

  const [classGroup, setClassGroup] = useState(initialClassGroupState);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/class-list");
  }

  const handleInputChange = (updatedClassGroup) => {
    setClassGroup(updatedClassGroup);
  };

  const validateForm = () => {
    const course = Number(classGroup.course);
    const number_students = Number(classGroup.number_students);
    const max_students = Number(classGroup.max_students);
    const weekly_hours = Number(classGroup.weekly_hours);

    if (course <= 0 || !classGroup.course_module || !classGroup.modality ||
      number_students <= 0 || max_students <= 0 ||
      !classGroup.location || weekly_hours <= 0) {
      setError("Todos los campos son obligatorios y deben tener valores válidos.");
      return false;
    }
    if (number_students > max_students) {
      setError("El número de estudiantes no puede ser mayor que el número máximo.");
      return false;
    }
    setError("");
    return true;
  };

  const saveClassGroup = () => {

    if (validateForm()) {
      let data = {
        course: parseInt(classGroup.course),
        course_module: classGroup.course_module.trim(),
        modality: classGroup.modality.trim(),
        number_students: parseInt(classGroup.number_students),
        max_students: parseInt(classGroup.max_students),
        location: classGroup.location.trim(),
        weekly_hours: parseInt(classGroup.weekly_hours)
      };

      ClassGroupDataService.create(data)
        .then(response => {
          setClassGroup({
            id: parseInt(response.data.id),
            course: parseInt(response.data.course),
            course_module: response.data.course_module.trim(),
            modality: response.data.modality.trim(),
            number_students: parseInt(response.data.number_students),
            max_students: parseInt(response.data.max_students),
            location: response.data.location.trim(),
            weekly_hours: parseInt(response.data.weekly_hours)
          });
          setSubmitted(true);
        })
        .catch(e => {
          console.log(e);
          setError("Hubo un problema al guardar el grupo de clase.");
        });
    }
  };

  const newClassGroup = () => {
    setClassGroup(initialClassGroupState);
    setSubmitted(false);
    setError("");
  };

  return (
    <>
      {submitted ? (
        <div>
          <h4>Se ha enviado correctamente</h4>
          <button onClick={newClassGroup}>Añadir otro grupo</button>
          <button onClick={handleClick}>Mostrar Lista</button>
        </div>
      ) : (
        <>
          <h4>Añadir Grupos de Clase</h4>
          <ClassGroupForm
            classGroup={classGroup}
            onChange={handleInputChange}
            onSubmit={saveClassGroup}
            submitText="Submit"
          />
          {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
          <button onClick={handleClick}>Mostrar la lista de Grupos de clase</button>
        </>
      )}
    </>
  );
};

export default AddClassGroup;