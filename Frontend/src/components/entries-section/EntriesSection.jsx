import { useState, useEffect, useRef } from 'react'
import taskSubmitService from '../../services/taskSubmitService'
import EntryHeader from './entry-header/EntryHeader'
import Entry from './entry/Entry'
import Modal from '../modal/Modal';
import { useNavigate } from 'react-router-dom'
import "./EntriesSection.css"

const EntriesSection = ({ savedMarks, selectedStatement, taskId, onStatementComplete, exercise, examStarted, handleSave }) => {
  const [statementData, setStatementData] = useState({});
  const [allStatementsData, setAllStatementsData] = useState({});
  const accounts = exercise?.chartOfAccounts || [];
  const confirmModalRef = useRef(null);
  const navigate = useNavigate();
  const [entriesData, setEntriesData] = useState([]);

  const currentStatementData = selectedStatement ? statementData[selectedStatement.id] : null;
  const entries = currentStatementData?.entries || [];
  const annotations = currentStatementData?.annotations || [];

  useEffect(() => {
    if (savedMarks && savedMarks.length > 0) {
      const newStatementData = {};
      
      savedMarks.forEach((mark) => {
        const entriesMap = {};
        const entries = mark.student_entries?.map(entry => {
          entriesMap[entry.id] = entry.entry_number;
          return {
            id: entry.id,
            entry_number: entry.entry_number,
            entry_date: entry.entry_date
          };
        }) || [];
        
        const annotations = mark.student_entries?.flatMap(entry => 
          entry.student_annotations?.map(anno => ({
            ...anno,
            id: anno.id,
            uid: anno.uid || `anno-${anno.id || Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            student_entry_id: entriesMap[entry.id]
          })) || []
        );
        
        newStatementData[mark.statement_id] = { entries, annotations };
      });
      
      setStatementData(newStatementData);
    }
  }, [savedMarks]);

  useEffect(() => {
    if (exercise?.marks) {
      const newStatementData = {};
      
      exercise.marks.forEach((mark) => {
        const entries = mark.student_entries?.map(entry => ({
          id: entry.id,
          entry_number: entry.entry_number,
          entry_date: entry.entry_date
        })) || [];
  
        const annotations = mark.student_entries?.flatMap(entry => 
          entry.student_annotations?.map(anno => ({
            id: anno.id,
            uid: anno.uid || `anno-${anno.id || Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            number: anno.number,
            student_entry_id: entry.entry_number,
            account_number: anno.account_number,
            account_name: anno.account.name,
            account_id: anno.account_id,
            debit: anno.debit,
            credit: anno.credit
          })) || []
        );
  
        newStatementData[mark.statement_id] = {
          entries,
          annotations
        };
      });
  
      setStatementData(newStatementData);
    }
  }, [exercise]);

  const addEntry = (statementId) => {
    const currentEntries = statementData[statementId]?.entries || [];
    const newEntryNumber = currentEntries.length > 0 
      ? Math.max(...currentEntries.map(e => e.entry_number)) + 1 
      : 1;
  
    const newEntry = {
      entry_number: newEntryNumber,
      entry_date: "2024-10-10",
    };
  
    setStatementData(prev => ({
      ...prev,
      [statementId]: {
        ...prev[statementId],
        entries: [...(prev[statementId]?.entries || []), newEntry],
      },
    }));
  };

  const removeEntry = (entryNumber) => {
    if (!selectedStatement) return;
  
    // Marcar entrada para eliminación en lugar de borrar directamente
    setStatementData((prevData) => ({
      ...prevData,
      [selectedStatement.id]: {
        entries: prevData[selectedStatement.id].entries.map(entry => 
          entry.entry_number === entryNumber 
            ? { ...entry, _destroy: true } 
            : entry
        ),
        annotations: prevData[selectedStatement.id].annotations.map(anno => 
          anno.student_entry_id === entryNumber
            ? { ...anno, _destroy: true } // Marcar anotaciones relacionadas
            : anno
        )
      },
    }));
  };

  const addAnnotation = (statementId, entryId) => {
    const newAnnotation = {
      uid: `annotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      student_entry_id: entryId,
      account_id: "",
      account_number: "",
      debit: 0,
      credit: 0,
    };
  
    setStatementData((prevData) => ({
      ...prevData,
      [statementId]: {
        ...prevData[statementId],
        annotations: [
          ...(prevData[statementId]?.annotations || []),
          newAnnotation,
        ],
      },
    }));
  };

  const updateAnnotation = (statementId, annotationUid, updatedAnnotation) => {
    if (!statementId || !statementData[statementId]) return;

    if (updatedAnnotation.account_number !== undefined) {
      const foundAccount = updatedAnnotation.account_id

      updatedAnnotation.account_id = foundAccount

    }

    setStatementData((prevData) => ({
      ...prevData,
      [statementId]: {
        ...prevData[statementId],
        annotations: prevData[statementId].annotations.map((annotation) =>
          annotation.uid === annotationUid ? { ...annotation, ...updatedAnnotation } : annotation
        ),
      },
    }));
  };

  const handleDeleteAnnotation = (annotationUid) => {
    if (!selectedStatement) return;
  
    setStatementData((prevData) => ({
      ...prevData,
      [selectedStatement.id]: {
        entries: entries,
        annotations: prevData[selectedStatement.id].annotations.map(annotation => 
          annotation.uid === annotationUid 
            ? { ...annotation, _destroy: true } // Marcar para eliminación
            : annotation
        )
      },
    }));
  };

  const handleSubmitStatement = () => {
    if (!selectedStatement) return;
    if(exercise?.task?.is_exam === false){
      handleSave(true);
    }
    setAllStatementsData((prevData) => ({
      ...prevData,
      [selectedStatement.id]: { entries, annotations },
    }));

    setStatementData((prevData) => ({
      ...prevData,
      [selectedStatement.id]: prevData[selectedStatement.id] || { entries: [], annotations: [] },
    }));
    if (onStatementComplete) {
      onStatementComplete(selectedStatement.id, { entries, annotations });
    }
  };

  const handleFinalSubmit = () => {
    if (!exercise || !exercise.id) {
      console.error("El objeto exercise no está definido correctamente:", exercise);
      return;
    }

    const updatedStatementsData = { ...allStatementsData, ...statementData };

    if (Object.keys(updatedStatementsData).length === 0) {
      console.error("❌ Error: No hay datos en updatedStatementsData", updatedStatementsData);
      return;
    }

    const dataToSubmit = {
      statementsData: updatedStatementsData,
      taskId: exercise.task.id,
      exerciseId: exercise.id,
    };

    taskSubmitService(dataToSubmit, navigate);
  };

  const updateEntryDate = (statementId, entryNumber, newDate) => {
    setStatementData((prevData) => ({
      ...prevData,
      [statementId]: {
        ...prevData[statementId],
        entries: prevData[statementId].entries.map((entry) =>
          entry.entry_number === entryNumber ? { ...entry, entry_date: newDate } : entry
        ),
      },
    }));
  };


  return (
    <div className='entry__container'>
      <EntryHeader addEntry={() => addEntry(selectedStatement.id)} selectedStatement={selectedStatement} examStarted={examStarted} exercise={exercise}/>
      <section className='modes-entries-containner scroll-style'>
        {entries.sort((a, b) => a.entry_number - b.entry_number).map((entry) => (
          <Entry
            key={entry.entry_number}
            entryIndex={entry.entry_number}
            number={entry.entry_number}
            date={entry.entry_date}
            annotations={annotations.filter(
              (annotation) => annotation.student_entry_id === entry.entry_number
            )}
            updateAnnotation={updateAnnotation}
            deleteAnnotation={handleDeleteAnnotation}
            addAnnotation={(entryId) => addAnnotation(selectedStatement.id, entryId)}
            deleteEntry={removeEntry}
            selectedStatement={selectedStatement}
            updateEntryDate={updateEntryDate}
            exercise={exercise}
          />
        ))}
      </section>
      <div className='modes-entries-container--buttons'>
        <button onClick={handleSubmitStatement} className='btn light' disabled={!examStarted || exercise.finished}>
          {exercise?.task?.is_exam ? "Guardar y Continuar" : "Guardar Progreso"}
        </button>
        <button onClick={() => confirmModalRef.current?.showModal()} className='btn' disabled={!examStarted || exercise.finished}>
          {exercise?.task?.is_exam ? "Enviar Examen" : "Finalizar Tarea"}
        </button>
      </div>

      <Modal ref={confirmModalRef} modalTitle="Confirmar envío" showButton={false}>
        <p>{exercise?.task?.is_exam ? "¿Está seguro de enviar el examen?" : "¿Está seguro de enviar la tarea?"}</p>
        <div className="modal__buttons">
          <button
            className="btn"
            onClick={() => {
              confirmModalRef.current?.close();
              handleFinalSubmit();
            }}
          >
            Sí
          </button>
          <button
            className="btn light"
            onClick={() => confirmModalRef.current?.close()}
          >
            No
          </button>
        </div>
      </Modal>

    </div >
  )
}

export default EntriesSection
