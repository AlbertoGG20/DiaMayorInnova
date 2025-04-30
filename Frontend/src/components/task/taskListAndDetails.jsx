import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import taskService from "../../services/taskService";
import TaskCreateForm from "./TaskCreateForm";
import { useAuth } from "../../context/AuthContext";
import TaskModal from "../modal/TaskModal";
import TaskDetails from "./TaskDetails";
import "./TaskPage.css";
import "./TaskList.css"

const TaskListAndDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); //Pagination
  const [totalPages, setTotalPages] = useState(1);
  const [showActiveTasks, setShowActiveTasks] = useState(true);


  useEffect(() => {
    if (location.state?.createTask || location.state?.newTask) {
      setIsCreatingTask(true);
    }

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await taskService.getAllTasks(currentPage, 5, searchTerm || "", showActiveTasks);

        if (!response) {
          throw new Error("No se recibió ninguna respuesta del servidor.");
        }

        if (!response.tasks) {
          throw new Error("La respuesta no tiene la estructura esperada.");
        }

        setTasks(response.tasks);
        setTotalPages(response.meta?.total_pages || 1);

      } catch (err) {
        setError(err.message);
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };


    if (user?.id) {
      fetchTasks();
    } else {
      setLoading(false);
      setTasks([]);
    }
  }, [user, location.state, currentPage, searchTerm, showActiveTasks]);

  const fetchTaskDetails = async (taskId) => {
    setLoading(true);
    try {
      const response = await taskService.getTaskWithStatements(taskId);
      setSelectedTask(response.data);
      setModalVisible(true);
    } catch (err) {
      setError("Error al cargar los detalles de la tarea.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    setIsSearching(value.trim() !== "");
  };

  const filteredTasks = isSearching
    ? tasks.filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : tasks;

  const handleTaskCreated = (newTask) => {
    if (newTask?.title) {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } else {
      const fetchTasks = async () => {
        try {
          const response = await taskService.getAllTasks();
          setTasks(response.data);
        } catch (err) {
          setError("Error al cargar las tareas.");
          console.error("Error fetching tasks:", err);
        }
      };
      fetchTasks();
    }
    setIsCreatingTask(false);
    navigate("/Home");
  };

  const handleDeleteStatement = async (taskId, statementId) => {
    try {
      await taskService.deleteStatementFromTask(taskId, statementId);
      const updatedTask = await taskService.getTaskWithStatements(taskId);
      setSelectedTask(updatedTask.data);
    } catch (error) {
      console.error("Error al eliminar el enunciado:", error);
    }
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTask(null);
  };

  const handleEditTask = () => {
    navigate("/task-edit", { state: { task: selectedTask } });
  };

  const handleDuplicatedTask = async (event, originalTask) => {
    event.stopPropagation();

    try {
      const response = await taskService.getTaskWithStatements(originalTask.id);
      const fullTask = response.data;

      const duplicatedTaskData = {
        ...fullTask,
        title: `${fullTask.title} - copia`,
        id: undefined, // remove id
      };

      navigate("/tasks", { state: { newTask: duplicatedTaskData } });
    } catch (error) {
      console.error("Error al duplicar la tarea:", error);
    }
  };

  const handleFilterChange = (isActive) => {
    setShowActiveTasks(isActive);
    setCurrentPage(1); // Resetear a la primera página
  };

  if (!user) return <p>Cargando usuario...</p>;
  if (loading) return <p>Cargando tareas... Por favor espera.</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      {isCreatingTask ? (
        <TaskCreateForm onTaskCreated={handleTaskCreated} />
      ) : (
        <>
          <section className="task-list">
            <header>
              <div className="task-list__header">
                <div className="task-list__title-container">
                  <h2 className="task-list__title">
                    {showActiveTasks ? "Tareas Activas" : "Tareas Cerradas"}
                  </h2>
                  <div className="task-list__filter">
                    <button 
                      className={`task-list__filter-button ${showActiveTasks ? 'active' : ''}`}
                      onClick={() => handleFilterChange(true)}
                    >
                      <i className="fi fi-rr-clock"></i>
                      Activas
                    </button>
                    <button 
                      className={`task-list__filter-button ${!showActiveTasks ? 'active' : ''}`}
                      onClick={() => handleFilterChange(false)}
                    >
                      <i className="fi fi-rr-check"></i>
                      Cerradas
                    </button>
                  </div>
                </div>
                <div className="task-list__search-container">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Buscar por Título"
                    className="task-list__search-input"
                    aria-label="Búsqueda por Título"
                  />
                  <i className="fi fi-rr-search task-list__search-icon"></i>
                </div>
              </div>
            </header>

            <ul className="task-list__items">
              {filteredTasks.map((task) => (
                <li key={`${task.id}-${task.created_at}`} className="task-list__item" onClick={() => fetchTaskDetails(task.id)}>
                  <div className="task-list__info">
                    <div className="task-list__info-header">
                      <p className="task-list__item-title">{task.title}</p>
                      <div className="task-list__square">
                        <i className="fi fi-rr-book-alt"></i>
                      </div>
                      <div className="task-list__square">
                        <button className="task-list__duplicate" onClick={(event) => handleDuplicatedTask(event, task)}>
                          <i className="fi fi-rr-copy" />
                        </button>
                      </div>
                    </div>
                    <div className="task-list__info-body">
                      <div className="task-list__date">
                        <i className="fi fi-rr-calendar"></i>
                        <strong>Apertura: </strong> {new Date(task.opening_date).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit', })}
                      </div>
                      <div className="task-list__date">
                        <i className="fi fi-rr-calendar"></i>
                        <strong>Cierre: </strong> {new Date(task.closing_date).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit', })}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="task-list__pagination">
              <button className="dt-paging-button" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
                <i className='fi fi-rr-angle-double-small-left' />
              </button>
              <button className="dt-paging-button" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
                <i className='fi fi-rr-angle-small-left' />
              </button>
              <span>Página {currentPage} de {totalPages}</span>
              <button className="dt-paging-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
                <i className='fi fi-rr-angle-small-right' />
              </button>
              <button className="dt-paging-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
                <i className='fi fi-rr-angle-double-small-right' />
              </button>
            </div>
          </section>

          <TaskModal show={modalVisible} onClose={handleCloseModal}>
            <TaskDetails
              selectedTask={selectedTask}
              onDeleteStatement={handleDeleteStatement}
              onEditTask={() => setIsEditingTask(true)}
              onDeleteTask={handleDeleteTask}
              onCloseModal={handleCloseModal}
              onDuplicateTask={handleDuplicatedTask}
            />
          </TaskModal>
        </>
      )}
    </>
  );
};

export default TaskListAndDetails;
