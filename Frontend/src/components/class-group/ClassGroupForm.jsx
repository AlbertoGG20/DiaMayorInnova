import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import SchoolsServices from "../../services/SchoolsServices";

const ClassGroupForm = ({ formData, handleInputChange, handleSubmit, errors, successMessage, onCancelEdit }) => {
  const { user } = useAuth();
  const [schoolCenters, setSchoolCenters] = useState([]);

  useEffect(() => {
    if (user.role === "admin") {
      SchoolsServices.getAll()
        .then((response) => {
          if (response && response.schools) {
            setSchoolCenters(response.schools);
          }
        })
        .catch((error) =>
          console.error("Error al obtener centros escolares:", error)
        );
    }
  }, [user.role]);

  return (
    <section className="class-group-page__form">
      <header className="class-group-page__form--header">
        <h2 className="class-group-page__header">{formData.id ? "Editar Grupo de Clase" : "Crear Grupo de Clase"}</h2>
      </header>
      <form className="class-group-page__form--form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group form-group--small">
          <label htmlFor="course">Curso</label>
          <input
            type="number"
            id="course"
            className="class-group-page__input"
            required
            value={formData.course}
            onChange={handleInputChange}
            name="course"
          />
          {errors.course && <p className="error-message">{errors.course}</p>}
        </div>

        <div className="form-group form-group--medium">
          <label htmlFor="course_module">Módulo</label>
          <input
            type="text"
            id="course_module"
            className="class-group-page__input"
            required
            value={formData.course_module}
            onChange={handleInputChange}
            name="course_module"
          />
        </div>

        <div className="form-group form-group--medium">
          <label htmlFor="modality">Modalidad</label>
          <input
            type="text"
            id="modality"
            className="class-group-page__input"
            required
            value={formData.modality}
            onChange={handleInputChange}
            name="modality"
          />
          {errors.course_module && <p className="error-message">{errors.course_module}</p>}
        </div>
        <div className="form-group form-group--medium">
          <label htmlFor="location">Aula</label>
          <input
            type="text"
            id="location"
            className="class-group-page__input"
            required
            value={formData.location}
            onChange={handleInputChange}
            name="location"
          />
        </div>
        </div>
        <div className="form-row">
        <div className="form-group form-group--small">
          <label className="long-label" htmlFor="number_students">Nº Estudiantes</label>
          <input
            type="number"
            id="number_students"
            className="class-group-page__input"
            required
            value={formData.number_students}
            onChange={handleInputChange}
            name="number_students"
          />
        </div>

        <div className="form-group form-group--small">
          <label className="long-label" htmlFor="max_students">Máx. estudiantes</label>
          <input
            type="number"
            id="max_students"
            className="class-group-page__input"
            required
            value={formData.max_students}
            onChange={handleInputChange}
            name="max_students"
          />
        </div>

        <div className="form-group form-group--small"> 
          <label htmlFor="weekly_hours">Hrs/semana</label>
          <input
            type="number"
            id="weekly_hours"
            className="class-group-page__input"
            required
            value={formData.weekly_hours}
            onChange={handleInputChange}
            name="weekly_hours"
          />
        </div>
        {user.role === "admin" ? (
          <div className="form-row">
          <div className="form-group form-group--full">
            <label
              htmlFor="school_center_id"
            >
              Centro Escolar
            </label>
            <select
              id="school_center_id"
              name="school_center_id"
              className="class-group-page__input"
              value={formData.school_center_id || ""}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione un centro</option>
              {schoolCenters.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.school_name}
                </option>
              ))}
            </select>
          </div>
          </div>
        ) : (
          <input
            type="hidden"
            name="school_center_id"
            value={user.school_center_id || ""}
          />
        )}
        </div>
        <div className="class-group-page__form--button-container">
          <button type="submit" className="btn"><i className='fi fi-rr-plus'></i>
            {formData.id ? "Actualizar" : "Crear"}
          </button>
          {formData.id && <button type="button" className="btn light" onClick={onCancelEdit}>Cancelar</button>}
          {successMessage && <p role="alert" style={{ color: "green" }}>{successMessage}</p>}
        </div>
      </form>
    </section>
  );
};

export default ClassGroupForm;