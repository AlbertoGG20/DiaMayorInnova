import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom';
import userExerciseDataService from "../../../services/userExerciseDataService";
import EntriesSection from '../../../components/entries-section/EntriesSection'
import { AuxSection } from '../../../components/aux-section/AuxSection'
import "./TaskPage.css"

const TaskPage = () => {
  const { exerciseId } = useParams();
  const [exercise, setExercise] = useState({
    marks: [],
    task: {}
  });
  const [taskStarted, setTaskStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [submitTask, setSubmitTask] = useState(false);
  const [canEditTask, setCanEditTask] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [openDate, setOpenDate] = useState(null);
  const [closeDate, setCloseDate] = useState(null);
  const [isTaskClosed, setIsTaskClosed] = useState(false);
  const [canStartTask, setCanStartTask] = useState(false);
  const [handleSave, setHandleSave] = useState(false);
  const [statementData, setStatementData] = useState({});

  const handleSelectStatement = (statement) => {
    setSelectedStatement(statement);
  };

  const handleEntriesChange = useCallback((entries) => {
    if (selectedStatement) {
      setStatementData(prev => {
        const newData = {
          ...prev,
          [selectedStatement.id]: {
            entries: entries.map(entry => ({
              entry_number: entry.entry_number,
              entry_date: entry.entry_date
            })),
            annotations: entries.flatMap(entry => 
              entry.annotations.map(anno => ({
                ...anno,
                student_entry_id: entry.entry_number
              }))
            )
          }
        };
        return newData;
      });
    }
  }, [selectedStatement]);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await userExerciseDataService.getById(exerciseId);
        if (response) {
          setExercise(response.exercise);
          const opDate = new Date(response.exercise.task.opening_date);
          const clDate = new Date(response.exercise.task.closing_date);
          setOpenDate(opDate);
          setCloseDate(clDate);

          const now = new Date();
          const isClosed = now > clDate;
          const isAvailable = now >= opDate && now <= clDate;

          setIsTaskClosed(isClosed);
          setCanStartTask(isAvailable);
          setCanEditTask(isAvailable && response.exercise.started);

          if (response.exercise.started && isAvailable) {
            setTaskStarted(true);
          }

          const firstMarkedStatement = response.exercise.marks?.[0]?.statement_id;
          const targetStatement = firstMarkedStatement
            ? response.exercise.task.statements.find(s => s.id === firstMarkedStatement)
            : response.exercise.task.statements[0];

          setSelectedStatement(targetStatement);
        }
      } catch (error) {
        console.error("Error fetching exercise:", error);
      }
    };

    if (exerciseId) fetchExercise();
  }, [exerciseId, handleSave]);

  useEffect(() => {
    if (exercise?.marks?.length > 0 && exercise.task?.statements) {
      const firstMark = exercise.marks[0];
      const targetStatement = exercise.task.statements.find(
        s => s.id === firstMark.statement_id
      );
      setSelectedStatement(targetStatement || exercise.task.statements[0]);
    }
  }, [exercise]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      if (openDate && closeDate) {
        setIsTaskClosed(now > closeDate);
        setCanStartTask(now >= openDate && now <= closeDate);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [openDate, closeDate]);

  const startTask = async () => {
    try {
      const response = await userExerciseDataService.start(exerciseId);
      if (response?.status === 200) {
        setTaskStarted(true);
        setCanEditTask(true);
      }
    } catch (err) {
      console.error("Error al iniciar la tarea:", err);
    }
  };

  if (!exercise) return <p>Cargando...</p>;

  let availabilityMessage = '';
  if (!canStartTask) {
    availabilityMessage = currentTime < openDate
    ? `La tarea estará disponible el ${openDate?.toLocaleString?.() || "fecha no disponible"}`
    : `La tarea cerró el ${closeDate?.toLocaleString?.() || "fecha no disponible"}`;
  }

  const handleSaveProgress = async (statementId, data) => {
    try {
      const existingMark = exercise.marks.find(
        (mark) => mark.statement_id === parseInt(statementId)
      );
  
      const payload = {
        exercise: {
          marks_attributes: [
            {
              id: existingMark?.id,
              statement_id: statementId,
              student_entries_attributes: data.entries.map((entry) => ({
                id: entry.id,
                entry_number: entry.entry_number,
                entry_date: entry.entry_date,
                _destroy: entry._destroy,
                student_annotations_attributes: data.annotations
                  .filter((a) => a.student_entry_id === entry.entry_number && !a._destroy)
                  .map((anno, index) => ({
                    id: anno.id,
                    account_id: anno.account_id,
                    number: index + 1,
                    debit: anno.debit,
                    credit: anno.credit,
                    _destroy: anno._destroy
                  })),
              })),
            },
          ],
        },
      };
  
      const response = await userExerciseDataService.updateTask(exercise.id, payload);
  
      if (response?.status === 200) {
        setExercise(prev => {
          // Verificación en profundidad de la respuesta
          const serverData = response.data?.exercise || {};
          const serverMarks = serverData.marks || [];
          
          // Procesar marcas del servidor
          const processedMarks = serverMarks.map(mark => ({
            ...mark,
            student_entries: (mark.student_entries || [])
              .filter(entry => !entry._destroy)
              .map(entry => ({
                ...entry,
                student_annotations: (entry.student_annotations || [])
                  .filter(anno => !anno._destroy)
              }))
          }));
  
          // Crear nuevo estado
          const newState = { 
            ...prev,
            marks: prev.marks.map(prevMark => {
              // Buscar si existe en la respuesta
              const updatedMark = processedMarks.find(
                m => m.statement_id === prevMark.statement_id
              );
              return updatedMark || prevMark;
            })
          };
  
          // Añadir nuevas marcas si no existían
          processedMarks.forEach(mark => {
            if (!newState.marks.some(m => m.statement_id === mark.statement_id)) {
              newState.marks.push(mark);
            }
          });
  
          return newState;
        });
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      setSaveStatus("Error al guardar el progreso");
    }
  };

  return (
    <div className='modes_page_container task-color'>
      {saveStatus && <div className="save-status">{saveStatus}</div>}
      {!taskStarted && (
        <div className='modes_page_container--button'>
          <button className="btn" onClick={startTask} disabled={!canStartTask}>
            Comenzar tarea
          </button>
          {!canStartTask && (
            <p className='exam-available'><strong>{availabilityMessage}</strong></p>
          )}
        </div>
      ) }
        <>
          <div className="task-page_header">
            <h1 className='head-task_tittle'>Modo Tarea - {exercise?.task?.title}</h1>
          </div>
          {exercise && (
            <EntriesSection
              taskSubmit={submitTask}
              taskId={exercise.task.id}
              existingExerciseId={exercise.id}
              examStarted={canEditTask}
              exercise={exercise}
              selectedStatement={selectedStatement}
              onStatementComplete={handleSaveProgress}
              savedMarks={exercise?.marks || []}
              handleSave={setHandleSave}
              onEntriesChange={handleEntriesChange}
            />
          )}
          <AuxSection
            statements={exercise?.task.statements}
            isTaskActive={canEditTask}
            onSelectStatement={handleSelectStatement}
            examStarted={taskStarted}
            helpAvailable={exercise.task.help_available}
            entries={Object.values(statementData).flatMap(data => 
              data.entries?.map(entry => ({
                ...entry,
                annotations: data.annotations?.filter(
                  anno => anno.student_entry_id === entry.entry_number && !anno._destroy
                ) || []
              })) || []
            )}
          />
        </>
    </div>
  )
}

export default TaskPage
