import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getStudentsMarkList, exportMarksToXlsx } from '../../services/exerciseMarksList';
import exerciseServices from '../../services/exerciseServices';
import './MarkList.css';
import Table from '../table/Table';
import Breadcrumbs from '../breadcrumbs/Breadcrumbs';
import ButtonBack from '../button-back/ButtonBack';
import PaginationMenu from '../pagination-menu/PaginationMenu';

const ExerciseMarksList = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [exerciseMarksList, setExerciseMarksList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  const taskId = location.state?.task_id;

  useEffect(() => {
    if (!taskId) return;

    const fetchMarkList = async () => {
      try {
        const response = await getStudentsMarkList(taskId, currentPage, 10);
        setExerciseMarksList(response.data.students);
        setTotalPages(response.data.meta.total_pages);
      } catch (error) {
        console.error('Error devolviendo la lista', error);
      }
    };

    fetchMarkList();
  }, [taskId, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleExportToXlsx = async () => {
    try {
      await exportMarksToXlsx(taskId);
    } catch (error) {
      console.error('Error al exportar las notas: ', error);
    }
  };

  const titles = ['Fecha', 'Nombre', '% Correcto', 'Nota', 'Estado', 'Acciones'];

  const handleViewResult = (exerciseId) => {
    navigate(`/notas-estudiantes/${id}/examen/${exerciseId}`);
    console.log('Ver resultado del ejercicio: ', exerciseId);
  };

  const handleToggleVisibility = async (exercise_id, newVisibility) => {
    try {
      await exerciseServices.update(exercise_id, { is_public: newVisibility });
      setExerciseMarksList((prevExerciseMarksList) =>
        prevExerciseMarksList.map((exerciseMark) =>
          exerciseMark.exercise_id === exercise_id
            ? { ...exerciseMark, is_public: newVisibility }
            : exerciseMark
        )
      );
    } catch (error) {
      const errorMessage = error.response && error.response.status === 403
        ? 'No puedes cambiar la visibilidad de notas ajenas.'
        : 'Error al cambiar visibilidad.';

      setErrorMessage(errorMessage)
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  };

  return (
    <div className="mark_list__page">
      <div className="mark_list__header">
        <ButtonBack />
        <Breadcrumbs />
        <button className="btn light" onClick={handleExportToXlsx}>
          <i className="fi fi-rr-download" /> Exportar en XLSX
        </button>
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="mark_list__table-container">

        {exerciseMarksList.length > 0 && <h2 className="mark_list__page--task">{exerciseMarksList[0].task_tittle}</h2>}

        <div className="mask_list_table__container">
          <Table
            titles={titles}
            data={exerciseMarksList}
            columnConfig={[
              { field: 'date', sortable: true },
              { field: 'student', sortable: true },
              {
                field: 'mark',
                sortable: true,
                render: (row) => (
                  <div>
                    <p>{row.mark * 10}%</p>
                    <progress value={row.mark * 0.1}></progress>
                  </div>
                )
              },
              {
                field: 'mark',
                sortable: true,
                align: 'right'
              },
              {
                field: 'mark',
                sortable: true,
                align: 'right',
                render: (row) => {
                  const [statusClass, statusIcon] = row.mark >= 5
                    ? ['status__container green', 'fi fi-rr-check']
                    : ['status__container red', 'fi fi-rr-x'];
                  return (
                    <div className="statement__state">
                      <div className={statusClass}>
                        <i className={statusIcon}></i>
                      </div>
                    </div>
                  );
                }
              },
              {
                field: 'exercise_id',
                render: (row) => (
                  <div className="table__actions">
                    <button
                      className="btn__table view-result"
                      onClick={() => handleViewResult(row.exercise_id)}
                    >
                      <i className="fi fi-rr-eye"></i>
                    </button>

                    <div className="statement-page__toggle-visibility">
                      <button
                        onClick={() => handleToggleVisibility(row.exercise_id, false)}
                        className={`toggle-option ${!row.is_public ? 'active' : ''}`}
                      >
                        Nota privada
                      </button>
                      <button
                        onClick={() => handleToggleVisibility(row.exercise_id, true)}
                        className={`toggle-option ${row.is_public ? 'active' : ''}`}
                      >
                        Nota pública
                      </button>
                    </div>
                  </div>
                )
              }
            ]}
            actions={false}
          />
        </div>

        <PaginationMenu
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

    </div>
  );
}

export default ExerciseMarksList;