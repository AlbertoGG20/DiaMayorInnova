import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import SchoolsServices from "../../services/SchoolsServices";

const ClassGroupForm = ({ formData, handleInputChange, handleSubmit, errors, successMessage, errorMessage, onCancelEdit }) => {
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
      <header >
        <h2 className="class-group-page__h2">{formData.id ? "Editar Grupo de Clase" : "Crear Grupo de Clase"}</h2>
      </header>
      <form className="class-group-page__form--form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group form-group--medium">
            <label htmlFor="cycle">Ciclo</label>
            <input
              type="text"
              id="cycle"
              className="class-group-page__input"
              required
              value={formData.cycle}
              onChange={handleInputChange}
              name="cycle"
              placeholder="Ej: Administración y Finanzas"
            />
          </div>
          <div className="form-group form-group--medium">
            <label htmlFor="module_name">Nombre del Módulo</label>
            <input
              type="text"
              id="module_name"
              className="class-group-page__input"
              required
              value={formData.module_name}
              onChange={handleInputChange}
              name="module_name"
              placeholder="Ej: Proceso Integral de la Actividad Comercial"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-row__sub-group">
            <div className="form-row__sub-group--left">
              <div className="form-group form-group--small">
                <label htmlFor="course_module">Código del Módulo</label>
                <input
                  type="text"
                  id="course_module"
                  className="class-group-page__input"
                  required
                  value={formData.course_module}
                  onChange={handleInputChange}
                  name="course_module"
                  placeholder="Ej: PNG"
                />
              </div>
              <div className="form-group form-group--small">
                <label htmlFor="group_name">Nombre del Grupo</label>
                <input
                  type="text"
                  id="group_name"
                  className="class-group-page__input"
                  required
                  value={formData.group_name}
                  onChange={handleInputChange}
                  name="group_name"
                  placeholder="Ej: A"
                />
              </div>
            </div>
            <div className="form-row__sub-group--right">
              <div className="form-group form-group--small">
                <label htmlFor="modality">Modalidad</label>
                <input
                  type="text"
                  id="modality"
                  className="class-group-page__input"
                  required
                  value={formData.modality}
                  onChange={handleInputChange}
                  name="modality"
                  placeholder="Ej: Presencial"
                />
              </div>
              <div className="form-group form-group--small">
                <label htmlFor="location">Aula</label>
                <input
                  type="text"
                  id="location"
                  className="class-group-page__input"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  name="location"
                  placeholder="Ej: Aula 1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-row__sub-group">
            <div className="form-row__sub-group--left">
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
                {errors.max_students && <p className="error-message">{errors.max_students}</p>}
              </div>
            </div>
            <div className="form-row__sub-group--right">
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
                {errors.weekly_hours && <p className="error-message">{errors.weekly_hours}</p>}
              </div>
              {user.role === "admin" ? (
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
              ) : (
                <input
                  type="hidden"
                  name="school_center_id"
                  value={user.school_center_id || ""}
                />
              )}
            </div>
          </div>
        </div>
        <div className="class-group-page__form--button-container">
          <button type="submit" className="btn"><i className='fi fi-rr-plus'></i>
            {formData.id ? "Actualizar" : "Crear"}
          </button>
          {formData.id && <button type="button" className="btn light" onClick={onCancelEdit}>Cancelar</button>}
          {successMessage && <p role="alert" style={{ color: "green" }}>{successMessage}</p>}
          {errorMessage && <p role="alert" style={{ color: "red" }}>{errorMessage}</p>}
        </div>
      </form>
    </section>
  );
};

export default ClassGroupForm;