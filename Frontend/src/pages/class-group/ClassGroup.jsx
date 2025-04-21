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
    if (!formData.course) newErrors.course = "El curso es obligatorio.";
    if (!formData.course_module) newErrors.course_module = "El módulo es obligatorio.";
    if (!formData.course) newErrors.course = "El curso es obligatorio.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      //setTimeout(() => setErrors({}), 5000);
      return;
    }
    try {
      const payload = { class_group: formData };
      if (formData.id) {
        // Actualizar grupo existente
        const response = await ClassGroupDataService.update(formData.id, payload);
        if (response && response.data) {
          setSuccessMessage("Grupo actualizado correctamente");
        }
      } else {
        // Crear nuevo grupo
        const response = await ClassGroupDataService.create(payload);
        if (response && response.data) {
          setSuccessMessage("Grupo creado correctamente");
          setFormData(initialClassGroupState());
        }
      }

      setFormData(initialClassGroupState);
      setErrors("");
      setRefreshTrigger((prev) => prev + 1);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error al guardar el grupo de clase:", error);
    }
  };

  const handleCancelEdit = () => {
    setFormData(initialClassGroupState());
    setErrors({});
    setSuccessMessage("");
  };

  return (
    <main className="class-group-page">
      <header className="class-group-page__header">
        <ButtonBack />
        <div className="class-group-page__title">
          <Breadcrumbs />
        </div>
      </header>
      <ClassGroupForm
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        errors={errors}
        successMessage={successMessage}
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