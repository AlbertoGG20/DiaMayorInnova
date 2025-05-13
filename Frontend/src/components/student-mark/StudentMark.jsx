import { useEffect, useState } from 'react'
import "./StudentMark.css";
import userExerciseDataService from '../../services/userExerciseDataService';
import Modal from '../modal/Modal'
import { Tooltip } from 'react-tooltip';
import PaginationMenu from '../pagination-menu/PaginationMenu';

const StudentMark = () => {

  const [marks, setMarks] = useState([]);
  const [includeMark, setIncludeMark] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5; // Set value

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const { data } = await userExerciseDataService.getAllCalification({
          page: currentPage,
          per_page: itemsPerPage,
          only_published: true
        });

        const exercises = data.exercises || [];
        setMarks(exercises);
        setIncludeMark(exercises.length > 0);
        setTotalPages(data.meta.total_pages || 1);
        
        // Si la página actual es mayor que el total de páginas y hay páginas disponibles,
        // volvemos a la primera página
        if (currentPage > data.meta.total_pages && data.meta.total_pages > 0) {
          setCurrentPage(1);
        }
      } catch (error) {
        console.error('Error fetching marks', error);
        setMarks([]);
        setIncludeMark(false);
        setTotalPages(1);
      }
    };

    fetchMarks();
  }, [currentPage]);

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <section className={includeMark ? "mark__section " : "mark__section principalSection__img"}>
      <h2 className='mark__title'>Calificaciones</h2>
      <div className="marks__wrapper">
        {
          includeMark && marks.map((task) => (

            <Modal
              key={"modal" + task.id}
              btnText={
                <div className="mark_container" data-testid={`mark-${task.id}`}>
                  <p className={`mark_mark ${task.total_mark < 5.0 ? 'mark_mark--fail' :
                    (task.total_mark >= 5.0 && task.total_mark <= 6.0) ? 'mark_mark--warning' : ''
                    }`}>
                    {task.total_mark !== null && task.total_mark !== undefined ?
                      (task.total_mark).toFixed(1) :
                      (task.marks && task.marks.length > 0 && task.marks.some(mark => mark.student_entries && mark.student_entries.length > 0) ? "0.0" : " - ")}
                  </p>
                  <p className='mark-text_title'>{task.task.title}</p>
                </div>
              }
              modalTitle={task.task.title}
            >
              <div className="exercise_modal__header">
                <h3
                  className='exercise_modal__mark'
                  data-tooltip-id="modal-tooltip"
                  data-tooltip-content="La nota se calcula haciendo la media de las notas de los apartados"
                >
                  Nota de la tarea {(task.total_mark).toFixed(1)}
                </h3>

                <Tooltip
                  id="modal-tooltip"
                  className='tooltip'
                  place='top-start'
                />
              </div>
              <div className="exercise_modal__container" key={task.id}>
                {
                  task.marks.map((mark) => (
                    <div className='exercise_marks' key={mark.id}>
                      <p>Nota del apartado {mark.mark}</p>
                      <div className="exercise_entries">
                        <h4>Asientos</h4>
                        {
                          mark.student_entries.map((entry, index) => (
                            <div className="exercise_entries__container" key={index + entry.entry_number}>
                              <div className="exercise_entry__header">
                                <p>Asiento {entry.entry_number}</p>
                                <p>Fecha {entry.entry_date}</p>
                              </div>
                              <div className="exercise_annotations">
                                <table>
                                  <thead>
                                    <tr>
                                      <th>Nº</th>
                                      <th>Nº Cuenta</th>
                                      <th>Debe</th>
                                      <th>Haber</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {
                                      entry.student_annotations.map((annotation, index) => (
                                        <tr key={index + annotation.account_number}>
                                          <td>{index + 1}</td>
                                          <td>{annotation.account_number}</td>
                                          <td>{annotation.debit}</td>
                                          <td>{annotation.credit}</td>
                                        </tr>
                                      ))
                                    }
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))
                        }
                      </div >
                    </div>
                  ))
                }
              </div>
            </Modal>

          ))
        }
      </div>

      {includeMark && (
        <PaginationMenu
          currentPage={currentPage}
          setCurrentPage={changePage}
          totalPages={totalPages}
        />
      )}

    </section>
  )
}

export default StudentMark
