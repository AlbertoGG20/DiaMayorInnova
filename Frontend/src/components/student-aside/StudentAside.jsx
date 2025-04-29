import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import exerciseService from "../../services/userExerciseDataService";
import Modal from "../modal/Modal";
import "./StudentAside.css";

const StudentAside = () => {

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const { user } = useAuth();

  const handleClick = (exerciseId) => {
    const selectedExercise = exercises.find((ex) => ex.id === exerciseId);

    if (!selectedExercise?.task) return;

    const route = selectedExercise.task.is_exam 
      ? `/modes/examen/${exerciseId}`
      : `/modes/tarea/${exerciseId}`;

    navigate(route);
  };

  useEffect(() => {
    if (!user?.id) return;
    const fetchExercises = async () => {
      try {
        const response = await exerciseService.getAll();
        if (response?.data) {
          setExercises(response.data);
        } else {
          setExercises([]);
        }
      } catch (error) {
        console.error("Error obteniendo los ejercicios:", error);
        setExercises([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [user?.id]);

  return (
    <section className={exercises.length > 0 ? "student__aside " : "student__aside asidelSection__img"}>
      <header className='student-aside__header'>
        <h2 className='aside__tittle'>Próximas Entregas</h2>
      </header>
      {loading ? (
        <p>Cargando...</p>
      ) : exercises.length > 0 ? (
        <ul className='student-aside__list-items'>
          {exercises.map((exercise) => (
            <li key={exercise.id} className='student-aside__list-item' onClick={() => handleClick(exercise.id)} style={{ cursor: "pointer" }}>
              <div className="student-aside__list-info">
                <div className="student-aside__info-header">
                  <p><strong>Tarea:</strong> {exercise.task.title || "Sin título"}</p>
                  <div className={`student-aside__square ${exercise.task.is_exam ? 'exam' : 'task'}`}>
                    <i className="fi fi-rr-book-alt"></i>
                  </div>
                </div>
                <div className="student-aside__list-info--body">
                  <div className="student-aside__date">
                    <i className="fi fi-rr-calendar"></i>
                    <p><strong>Apertura:</strong> {new Date(exercise.task.opening_date).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit', })}</p>
                  </div>
                  <div className="student-aside__date">
                    <i className="fi fi-rr-calendar"></i>
                    <p><strong>Cierre:</strong> {new Date(exercise.task.closing_date).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit', })}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes tareas asignadas.</p>
      )}

      <Modal
        ref={modalRef}
        modalTitle="Atención"
        showButton={false}
      >
        <p>Este examen ya se ha iniciado y no se puede acceder nuevamente.</p>
      </Modal>
    </section>
  )
}

export default StudentAside
