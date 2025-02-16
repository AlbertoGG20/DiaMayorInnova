import React from "react";
import dateTimeFormat from "../../utils/dateTimeFormat";
import "./TaskPage.css";

const TaskForm = ({ title, setTitle, openingDate, setOpeningDate, closingDate, setClosingDate, handleSubmit, errors }) => {

  return (
    <section className="task-page__form">
      <form className="task-page__form--form">
        <h2 className="task-page__header">Crear Tarea</h2>
        <div>
          <label className="task-page__label--title">Tarea:</label>
          <input
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
            <label className="task-page__label">Fecha de apertura:</label>
            <input
              className="task-page__input"
              type="date"
              value={openingDate}
              onChange={(e) => setOpeningDate(e.target.value)}
            />
          </div>
          <div className="task-page__date">
            <label className="task-page__label">Fecha de cierre:</label>
            <input
              className="task-page__input"
              type="datetime-local"
              value={closingDate ? dateTimeFormat(closingDate) : ""}
              onChange={(e) => setClosingDate(e.target.value)}
            />
          </div>
        </div>
        <div className="task-page__dates--errors">
          {errors.openingDate && <p className="error-message">{errors.openingDate}</p>}
          {errors.closingDate && <p className="error-message">{errors.closingDate}</p>}
        </div>
        <button type="button" className="task-page__button--form" onClick={handleSubmit}>
          Finalizar
        </button>
      </form>
    </section>
  );
};

export default TaskForm;
