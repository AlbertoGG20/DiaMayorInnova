import { useState } from "react";
import ClassGroupDataService from "../../services/ClassGroupService";
import ClassGroupForm from "../../components/class-group/ClassGroupForm";
import ClassGroupsList from "../../components/class-group/ClassGroupList";
import { useAuth } from "../../context/AuthContext";
import "./ClassGroup.css";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import ButtonBack from "../../components/button-back/ButtonBack";

const ClassGroup = () => {
  const auth = useAuth();
  const initialClassGroupState = () => ({
    id: null,
    course: 0,
    course_module: "",
    module_name: "",
    cycle: "",
    group_name: "",
    modality: "",
    number_students: 0,
    max_students: 0,
    location: "",
    weekly_hours: 0,
    school_center_id: auth.user.role === "admin" ? "" : auth.user.school_center_id
  });
  const [formData, setFormData] = useState(initialClassGroupState());
  const [errors, setErrors] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [studentCounts, setStudentCounts] = useState({});

  const handleEditClassGroup = (group) => {
    const editedGroup = auth.user.role !== "admin"
      ? { ...group, school_center_id: auth.user.school_center_id }
      : group;
    setFormData(editedGroup);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.course || formData.course <= 0) newErrors.course = "El curso es obligatorio y debe ser mayor que 0.";
    if (!formData.course_module) newErrors.course_module = "El código del módulo es obligatorio.";
    if (!formData.module_name) newErrors.module_name = "El nombre del módulo es obligatorio.";
    if (!formData.cycle) newErrors.cycle = "El ciclo es obligatorio.";
    if (!formData.modality) newErrors.modality = "La modalidad es obligatoria.";
    if (!formData.group_name) newErrors.group_name = "El nombre del grupo es obligatorio.";
    if (!formData.location) newErrors.location = "El aula es obligatoria.";
    if (!formData.max_students || formData.max_students <= 0) {
      newErrors.max_students = "El número máximo de estudiantes debe ser mayor que 0.";
    }
    if (!formData.weekly_hours || formData.weekly_hours <= 0) {
      newErrors.weekly_hours = "Las horas semanales deben ser mayores que 0.";
    }
    if (formData.number_students > formData.max_students) {
      newErrors.number_students = "El número de estudiantes no puede exceder el máximo permitido.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setTimeout(() => setErrors({}), 5000);
      return;
    }
    try {
      const payload = { class_group: formData };
      if (formData.id) {
        // Actualizar grupo existente
        const response = await ClassGroupDataService.update(formData.id, payload);
        if (response && response.data) {
          setSuccessMessage("Grupo actualizado correctamente");
          setFormData(initialClassGroupState());
          setRefreshTrigger((prev) => prev + 1);
        }
      } else {
        // Crear nuevo grupo
        const response = await ClassGroupDataService.create(payload);
        if (response && response.data) {
          setSuccessMessage("Grupo creado correctamente");
          setFormData(initialClassGroupState());
          setRefreshTrigger((prev) => prev + 1);
        }
      }
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error al guardar el grupo de clase:", error);
      if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Error al guardar el grupo de clase. Por favor, inténtelo de nuevo.");
      }
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleCancelEdit = () => {
    setFormData(initialClassGroupState());
    setErrors({});
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <main className="class-group-page">
      <header className="class-group-page__header">
        <ButtonBack />
        <Breadcrumbs />
      </header>
      
      <ClassGroupForm
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        errors={errors}
        successMessage={successMessage}
        errorMessage={errorMessage}
        onCancelEdit={handleCancelEdit}
      />
      <ClassGroupsList
        refreshTrigger={refreshTrigger}
        onEdit={handleEditClassGroup}
        maxStudents={formData.max_students}
      />
    </main>
  );
};

export default ClassGroup;