import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import taskSubmitService from '../../services/taskSubmitService'
import EntryHeader from './entry-header/EntryHeader'
import Entry from './entry/Entry'
import Modal from '../modal/Modal';
import { useNavigate } from 'react-router-dom'
import "./EntriesSection.css"

const EntriesSection = ({ savedMarks, selectedStatement, taskId, onStatementComplete, exercise, examStarted, handleSave, onEntriesChange }) => {
  const [statementData, setStatementData] = useState({});
  const [allStatementsData, setAllStatementsData] = useState({});
  const accounts = exercise?.chartOfAccounts || [];
  const confirmModalRef = useRef(null);
  const navigate = useNavigate();
  const [entriesData, setEntriesData] = useState([]);

  const currentStatementData = selectedStatement ? statementData[selectedStatement.id] : null;
  const entries = useMemo(() => currentStatementData?.entries || [], [currentStatementData]);
  const annotations = useMemo(() => currentStatementData?.annotations || [], [currentStatementData]);

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
            account_number: anno.account_number || "",
            account_name: anno.account_name || anno.account?.name || "",
            account_id: anno.account_id || "",
            debit: anno.debit || "",
            credit: anno.credit || ""
          })) || []
        );
  
        newStatementData[mark.statement_id] = {
          entries,
          annotations
        };
      });
  
      setStatementData(newStatementData);
    }
  }, [exercise?.marks]);

  const addEntry = useCallback((statementId) => {
    // Obtener todas las entradas de todos los statements
    const allEntries = Object.values(statementData).flatMap(data => data.entries || []);
    
    // Encontrar el número máximo de entrada
    const maxEntryNumber = allEntries.length > 0 
      ? Math.max(...allEntries.map(e => e.entry_number)) 
      : 0;
    
    // El nuevo número de entrada será el máximo + 1
    const newEntryNumber = maxEntryNumber + 1;
  
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
  }, [statementData]);

  const removeEntry = useCallback((entryNumber) => {
    if (!selectedStatement) return;
  
    setStatementData((prevData) => {
      const updatedEntries = prevData[selectedStatement.id].entries.filter(
        (entry) => entry.entry_number !== entryNumber
      );
  
      return {
        ...prevData,
        [selectedStatement.id]: {
          entries: updatedEntries,
          annotations: prevData[selectedStatement.id].annotations.filter(
            (annotation) => annotation.student_entry_id !== entryNumber
          ),
        },
      };
    });
  }, [selectedStatement]);

  const updateEntryDate = useCallback((statementId, entryNumber, newDate) => {
    setStatementData((prevData) => ({
      ...prevData,
      [statementId]: {
        ...prevData[statementId],
        entries: prevData[statementId].entries.map((entry) =>
          entry.entry_number === entryNumber
            ? { ...entry, entry_date: newDate }
            : entry
        ),
      },
    }));
  }, []);

  const addAnnotation = useCallback((statementId, entryId) => {
    if (!selectedStatement) return;
  
    const newAnnotation = {
      uid: `anno-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      student_entry_id: entryId,
      account_number: "",
      account_name: "",
      debit: "",
      credit: "",
    };
  
    setStatementData((prevData) => ({
      ...prevData,
      [statementId]: {
        ...prevData[statementId],
        entries: prevData[statementId]?.entries || [],
        annotations: [...(prevData[statementId]?.annotations || []), newAnnotation],
      },
    }));
  }, [selectedStatement]);

  const updateAnnotation = useCallback((statementId, annotationUid, updatedAnnotation) => {
    if (!selectedStatement) return;
  
    setStatementData((prevData) => ({
      ...prevData,
      [statementId]: {
        ...prevData[statementId],
        annotations: prevData[statementId].annotations.map((annotation) =>
          annotation.uid === annotationUid
            ? { ...annotation, ...updatedAnnotation }
            : annotation
        ),
      },
    }));
  }, [selectedStatement]);

  const handleDeleteAnnotation = useCallback((annotationUid) => {
    if (!selectedStatement) return;
  
    setStatementData((prevData) => ({
      ...prevData,
      [selectedStatement.id]: {
        entries: entries,
        annotations: prevData[selectedStatement.id].annotations.map(annotation => 
          annotation.uid === annotationUid 
            ? { ...annotation, _destroy: true }
            : annotation
        )
      },
    }));
  }, [selectedStatement, entries]);

  const handleSubmitStatement = useCallback(() => {
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
  }, [selectedStatement, exercise?.task?.is_exam, handleSave, entries, annotations, onStatementComplete]);

  const handleFinalSubmit = useCallback(() => {
    if (!exercise || !exercise.id) {
      console.error("El objeto exercise no está definido correctamente:", exercise);
      return;
    }

    const updatedStatementsData = { ...allStatementsData, ...statementData };

    const filteredStatementsData = Object.entries(updatedStatementsData).reduce((acc, [statementId, data]) => {
      acc[statementId] = {
        entries: data.entries,
        annotations: data.annotations.filter(anno => !anno._destroy)
      };
      return acc;
    }, {});

    if (Object.keys(filteredStatementsData).length === 0) {
      console.error("❌ Error: No hay datos en updatedStatementsData", filteredStatementsData);
      return;
    }

    const dataToSubmit = {
      statementsData: filteredStatementsData,
      taskId: exercise.task.id,
      exerciseId: exercise.id,
    };

    taskSubmitService(dataToSubmit, navigate);
  }, [allStatementsData, statementData, exercise, navigate]);

  useEffect(() => {
    if (onEntriesChange && selectedStatement) {
      const formattedEntries = entries
        .filter(entry => !entry._destroy)
        .map(entry => ({
          ...entry,
          annotations: annotations
            .filter(anno => anno.student_entry_id === entry.entry_number && !anno._destroy)
            .map(anno => ({
              ...anno,
              _destroy: anno._destroy || false
            }))
        }));
      onEntriesChange(formattedEntries);
    }
  }, [entries, annotations, onEntriesChange, selectedStatement?.id]);

  return (
    <div className='entry__container'>
      <div className='entry_content_container'>
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
      </div>
      <div className='modes-entries-container--buttons'>
        <button onClick={handleSubmitStatement} className='btn light' disabled={!examStarted || exercise.finished}>
          {exercise?.task?.is_exam ? "Guardar y Continuar" : "Guardar Progreso"}
        </button>
        <button onClick={() => confirmModalRef.current?.showModal()} className='btn' disabled={!examStarted || exercise.finished}>
          {exercise?.task?.is_exam ? "Enviar Examen" : "Finalizar Tarea"}
        </button>
      </div>

      <Modal
        ref={confirmModalRef}
        modalTitle="Confirmar envío"
        showButton={false}
      >
        <p>¿Estás seguro de que quieres enviar la tarea? No podrás hacer más cambios después.</p>
        <div className="modal-buttons">
          <button className="btn light" onClick={() => confirmModalRef.current?.close()}>
            Cancelar
          </button>
          <button className="btn" onClick={handleFinalSubmit}>
            Confirmar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default EntriesSection;
