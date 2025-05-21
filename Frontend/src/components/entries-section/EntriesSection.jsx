import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentDate } from '../../utils/dateUtils'
import { generateUid } from '../../utils/generateUid'
import taskSubmitService from '../../services/taskSubmitService'
import Modal from '../modal/Modal';
import EntryHeader from './entry-header/EntryHeader'
import Entry from './entry/Entry'
import './EntriesSection.css'

const EntriesSection = ({ savedMarks, selectedStatement, taskId, onStatementComplete, exercise, examStarted, onEntriesChange }) => {
  const [statementData, setStatementData] = useState({});
  const [allStatementsData, setAllStatementsData] = useState({});
  const confirmModalRef = useRef(null);
  const navigate = useNavigate();

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
            uid: anno.uid || generateUid(`anno-${anno.id || Date.now()}`),
            student_entry_id: entriesMap[entry.id],
          })) || []
        );

        newStatementData[mark.statement_id] = { entries, annotations };
      });

      setStatementData(newStatementData);
      setAllStatementsData(newStatementData);
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
            uid: anno.uid || generateUid(`anno-${anno.id || Date.now()}`),
            number: anno.number,
            student_entry_id: entry.entry_number,
            account_number: anno.account?.account_number || '',
            account_name: anno.account_name || anno.account?.name || '',
            account_id: anno.account_id || '',
            debit: anno.debit || '',
            credit: anno.credit || ''
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

  useEffect(() => {
    if (selectedStatement && currentStatementData) {
      setAllStatementsData(prevData => ({
        ...prevData,
        [selectedStatement.id]: currentStatementData
      }));
    }
  }, [selectedStatement, currentStatementData]);

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
      entry_date: getCurrentDate(),
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
      const currentStatement = prevData[selectedStatement.id];
      if (!currentStatement) return prevData;

      const { entries, annotations } = currentStatement;
      const updatedEntries = entries.filter(
        entry => entry.entry_number !== entryNumber
      );
      const updatedAnnotations = annotations.filter(
        annotation => annotation.student_entry_id !== entryNumber
      );

      return {
        ...prevData,
        [selectedStatement.id]: {
          entries: updatedEntries,
          annotations: updatedAnnotations,
        },
      };
    });
  }, [selectedStatement]);

  const updateEntryDate = useCallback((statementId, entryNumber, newDate) => {
    setStatementData((prevData) => {
      const updatedData = {
        ...prevData,
        [statementId]: {
          ...prevData[statementId],
          entries: prevData[statementId].entries.map((entry) =>
            entry.entry_number === entryNumber
              ? { ...entry, entry_date: newDate }
              : entry
          ),
        },
      };

      // Notificar cambios si hay un callback
      if (onEntriesChange) {
        const formattedEntries = updatedData[statementId].entries
          .filter(entry => !entry._destroy)
          .map(entry => ({
            ...entry,
            annotations: updatedData[statementId].annotations
              .filter(anno => anno.student_entry_id === entry.entry_number && !anno._destroy)
              .map(anno => ({
                ...anno,
                _destroy: anno._destroy || false
              }))
          }));
        onEntriesChange(formattedEntries);
      }

      return updatedData;
    });
  }, [onEntriesChange]);

  const addAnnotation = useCallback((statementId, entryId) => {
    if (!selectedStatement) return;

    const newAnnotation = {
      uid: generateUid(`anno-${Date.now()}`),
      student_entry_id: entryId,
      account_number: '',
      account_name: '',
      debit: '',
      credit: '',
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

    const currentData = { entries, annotations };

    setStatementData(prevData => ({
      ...prevData,
      [selectedStatement.id]: currentData
    }));

    setAllStatementsData(prevData => ({
      ...prevData,
      [selectedStatement.id]: currentData
    }));

    if (onStatementComplete) {
      if (!exercise?.task?.is_exam) {
        const allData = {
          ...allStatementsData,
          [selectedStatement.id]: currentData
        };
        onStatementComplete(selectedStatement.id, allData);
      } else {
        onStatementComplete(selectedStatement.id, currentData);
      }
    }

  }, [selectedStatement, exercise?.task?.is_exam, entries, annotations, onStatementComplete, allStatementsData]);

  const handleFinalSubmit = useCallback(() => {
    if (!exercise || !exercise.id) {
      console.error('El objeto exercise no está definido correctamente:', exercise);
      return;
    }

    const updatedStatementsData = { ...allStatementsData, ...statementData };

    if (Object.keys(updatedStatementsData).length === 0) {
      console.error('❌ Error: No hay datos en updatedStatementsData', updatedStatementsData);
      return;
    }

    const filteredStatementsData = Object.entries(updatedStatementsData).reduce((acc, [statementId, data]) => {
      acc[statementId] = {
        entries: data.entries,
        annotations: data.annotations.filter(anno => !anno._destroy)
      };
      return acc;
    }, {});

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
          {exercise?.task?.is_exam ? 'Guardar y Continuar' : 'Guardar Progreso'}
        </button>
        <button onClick={() => confirmModalRef.current?.showModal()} className='btn' disabled={!examStarted || exercise.finished}>
          {exercise?.task?.is_exam ? 'Enviar Examen' : 'Finalizar Tarea'}
        </button>
      </div>

      <Modal
        ref={confirmModalRef}
        modalTitle='Confirmar envío'
        showButton={false}
      >
        <p>¿Estás seguro de que quieres enviar la tarea? No podrás hacer más cambios después.</p>
        <div className='modal-buttons'>
          <button className='btn light' onClick={() => confirmModalRef.current?.close()}>
            Cancelar
          </button>
          <button className='btn' onClick={handleFinalSubmit}>
            Confirmar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default EntriesSection;
