import React, { useState, useEffect } from "react";
import statementService from "../../services/statementService";
import taskService from "../../services/taskService";
import { useAuth } from "../../context/AuthContext";
import TaskForm from "./TaskForm.jsx";
import TaskPreview from "./TaskPreview.jsx";
import StatementsSelection from "./StatementsSelection.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import "./TaskPage.css";
import exerciseServices from "../../services/exerciseServices.js";
import ButtonBack from "../button-back/ButtonBack.jsx";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs.jsx";

const TaskCreateForm = ({ onTaskCreated }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const task = state?.task || state?.newTask || null;
  const { user } = useAuth();
  const [title, setTitle] = useState(task?.title || "");
  const [openingDate, setOpeningDate] = useState(task?.opening_date || "");
  const [closingDate, setClosingDate] = useState(task?.closing_date || "");
  const [statements, setStatements] = useState([]);
  const [selectedStatements, setSelectedStatements] = useState(task?.statements ? task.statements.map(s => s.id ?? s) : []);
  const [solutions, setSolutions] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (task?.id && !state?.newTask) {
      setEditMode(true);
    }
  }, [task, state]);

  const [currentUsers, setCurrentUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [additionalInformation, setAdditionalInformation] = useState(task?.additional_information || "");
  const [isExam, setIsExam] = useState(task?.is_exam || false);
  const [isHelpAvailable, setIsHelpAvailable] = useState(task?.help_available || false);
  const [errors, setErrors] = useState({
    title: "",
    openingDate: "",
    closingDate: ""
  });

  const usersByTaskId = (id) => {
    exerciseServices.getByTaskId(id)
      .then(({ data }) => {
        setCurrentUsers(data)
        setAssignedUsers(data)
      });
  }

  const assignedInclude = (id) => {
    return currentUsers.includes(id);
  }

  const deleteUser = (id) => {
    const filteredUsers = assignedUsers.filter(user => !currentUsers.includes(user));
    if (filteredUsers.length !== 0) {
      const data = {
        "task_id": id,
        "user_id": filteredUsers
      }
      exerciseServices.deleteOnGroup(data)
        .then((response) => {
        })
    }
  }

  const addUsers = (id) => {
    const filteredUsers = currentUsers.filter(user => !assignedUsers.includes(user));
    if (filteredUsers.length !== 0) {

      const data = {
        "exercise": {
          "task_id": id,
          "user_id": filteredUsers
        }
      }
      exerciseServices.create(data)
        .then((response) => {
        })
    }
  }

  useEffect(() => {
    if (task && task.id) {
      usersByTaskId(task.id)
    }

    const fetchStatements = async () => {
      try {
        const response = await statementService.getAllStatements();
        setStatements(response.data);
      } catch (error) {
        console.error("Error fetching statements:", error);
      }
    };

    fetchStatements();
  }, []);

  const handleStatementSelection = (statement) => {
    if (selectedStatements.includes(statement.id)) {
      setSelectedStatements((prevSelected) => prevSelected.filter((id) => id !== statement.id));
    } else {
      setSelectedStatements((prevSelected) => [...prevSelected, statement.id]);
    }
  };

  const handleViewSolutions = async (statementId) => {
    try {
      const response = await statementService.getSolutions(statementId);
      setSolutions((prev) => ({ ...prev, [statementId]: response.data }));
    } catch (error) {
      console.error("Error fetching solutions:", error);
    }
  };

  const handleEditSolutions = (statementId) => {
    setEditMode((prev) => (prev === statementId ? false : statementId));
  };

  const handleRemoveStatement = (statementId) => {
    setSelectedStatements((prev) => prev.filter((id) => id !== statementId));
  };

  const handleSubmit = async () => {
    let valid = true;
    let errors = {};

    if (!title) {
      valid = false;
      errors.title = "El título es obligatorio.";
    }
    if (!openingDate) {
      valid = false;
      errors.openingDate = "La fecha de apertura es obligatoria.";
    }
    if (!closingDate) {
      valid = false;
      errors.closingDate = "La fecha de cierre es obligatoria.";
    }

    if (openingDate && closingDate) {
      const opening = new Date(openingDate);
      const closing = new Date(closingDate);

      if (opening >= closing) {
        valid = false;
        errors.title = "La fecha de apertura debe ser anterior a la fecha de cierre.";
      }
    }

    setErrors(errors);

    if (Object.keys(errors).length > 0) {
      setTimeout(() => {
        setErrors({});
      }, 5000);
    }

    if (!valid) return;
    const taskData = {
      title,
      opening_date: openingDate,
      closing_date: closingDate,
      additional_information: additionalInformation,
      is_exam: isExam,
      help_available: isHelpAvailable,
      statement_ids: selectedStatements,
      created_by: user.id,
    };

    try {
      if (task?.id) {
        await taskService.updateTask(task.id, taskData);
        addUsers(task.id);
        deleteUser(task.id);
        navigate("/");
      } else {
        const response = await taskService.createTask(taskData);
        const createdTask = await taskService.getTaskWithStatements(response.data.id);
        addUsers(response.data.id);
        onTaskCreated(createdTask.data);
      }
    } catch (error) {
      console.error("Error creando la tarea:", error);
    }
  };

  return (
    <main className="task-page">
      <header className="task-page__header--header">
        <ButtonBack />
        <div className="task-title">
          <Breadcrumbs />
        </div>
      </header>
      <TaskForm
        title={title}
        setTitle={setTitle}
        openingDate={openingDate}
        setOpeningDate={setOpeningDate}
        closingDate={closingDate}
        setClosingDate={setClosingDate}
        additionalInformation={additionalInformation}
        setAdditionalInformation={setAdditionalInformation}
        isExam={isExam}
        setIsExam={setIsExam}
        isHelpAvailable={isHelpAvailable}
        setIsHelpAvailable={setIsHelpAvailable}
        handleSubmit={handleSubmit}
        errors={errors}
        id={task && task.id}
        assignedInclude={assignedInclude}
        setCurrentUsers={setCurrentUsers}
        currentUsers={currentUsers}
      />
      <StatementsSelection
        statements={statements}
        selectedStatements={selectedStatements}
        handleStatementSelection={handleStatementSelection}
        handleViewSolutions={handleViewSolutions}
        handleEditSolutions={handleEditSolutions}
        solutions={solutions}
        editMode={editMode}
      />
      <TaskPreview
        title={title}
        openingDate={openingDate}
        closingDate={closingDate}
        statements={statements}
        selectedStatements={selectedStatements}
        handleRemoveStatement={handleRemoveStatement}
        additionalInformation={additionalInformation}
        isExam={isExam}
        isHelpAvailable={isHelpAvailable}
      />
    </main>
  );
};

export default TaskCreateForm;
