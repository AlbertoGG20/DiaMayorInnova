import React from "react";
import { useNavigate } from "react-router-dom";
import dateTimeFormat from "../../utils/dateTimeFormat";
import "./TaskPage.css";
import AssignTaskUser from "../assignTaskUser/AssignTaskUser";

const TaskForm = ({
  title, setTitle,
  openingDate, setOpeningDate,
  closingDate, setClosingDate,
  additionalInformation, setAdditionalInformation,
  isExam, setIsExam,
  handleSubmit,
  errors,
  id,
  assignedInclude,
  setCurrentUsers,
  currentUsers,
  isHelpAvailable,
  setIsHelpAvailable
}) => {
  const navigate = useNavigate();

  return (
    <section className="task-page__form">
      <form className="task-page__form--form">
        <header className="task-page__form--header">
          <h2 className="task-page__header">Crear Tarea</h2>
        </header>
        <div>
          <label className="task-page__label--title" htmlFor="title">Tarea:</label>
          <input
            id="title"
            className="task-page__input"
            type="text"
            placeholder="Título de la tarea"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <p className="error-message">{errors.title}</p>}
        </div>
        <div className="task-page__dates">
          <div className="task-page__date">
            <label className="task-page__label" htmlFor="opening_date">Fecha de apertura:</label>
            <input
              id="opening_date"
              className="task-page__input"
              type="datetime-local"
              value={openingDate ? dateTimeFormat(openingDate) : ""}
              onChange={(e) => setOpeningDate(e.target.value)}
            />

          </div>
          <div className="task-page__date">
            <label className="task-page__label" htmlFor="closing_date">Fecha de cierre:</label>
            <input
              id="closing_date"
              className="task-page__input"
              type="datetime-local"
              value={closingDate ? dateTimeFormat(closingDate) : ""}
              onChange={(e) => setClosingDate(e.target.value)}
            />
          </div>
        </div>
        <div className="task-page__others">
          <div>
            <label className="task-page__label" htmlFor="additional_information">Información adicional:</label>
            <textarea
              id="additional_information"
              className="task-page__input"
              value={additionalInformation}
              onChange={(e) => setAdditionalInformation(e.target.value)}
            />
          </div>
          <div className="task-page__checkbox_container">
            <div className="task-page__container--exam">
              <label className="task-page__label--exam" htmlFor="isExam">¿Es un examen?</label>
              <input
                id="isExam"
                type="checkbox"
                checked={isExam}
                className="task-page__checkbox--exam"
                onChange={(e) => setIsExam(e.target.checked)}
              />
            </div>
            <div className="task-page__container--exam">
              <label className="task-page__label--exam" htmlFor="setIsHelpAvailable">Ayuda disponible</label>
              <input
                id="setIsHelpAvailable"
                type="checkbox"
                checked={isHelpAvailable}
                className="task-page__checkbox--exam"
                onChange={(e) => setIsHelpAvailable(e.target.checked)}
              />
            </div>
          </div>
        </div>
        <div className="task-page__dates--errors">
          {errors.openingDate && <p className="error-message">{errors.openingDate}</p>}
          {errors.closingDate && <p className="error-message">{errors.closingDate}</p>}
        </div>
        <div className="task-page__buttons-container">
          <div className="task-page__buttons-container--edition">
            <button
              type="button"
              className="task-page__button--form"
              onClick={handleSubmit}
            >
              {id ? "Actualizar" : "Crear"}
            </button>
            {id && (
              <button
                type="button"
                className="task-page__button--form task-page__button--cancel btn light"
                onClick={() => navigate("/home")}
              >
                Cancelar
              </button>
            )}
          </div>
          <AssignTaskUser
            id={id}
            assignedInclude={assignedInclude}
            setCurrentUsers={setCurrentUsers}
            currentUsers={currentUsers}
          />
          <button
            type="button"
            // className="task-page__button--form"
            className="btn light"
            onClick={() => navigate("/add-statements")}
          >
            <i className="fi fi-rr-arrow-right"></i>
            Ir a enunciados
          </button>
        </div>
      </form>
    </section>
  );
};

export default TaskForm;
