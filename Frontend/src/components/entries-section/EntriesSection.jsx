import useEntry from '../../hooks/useEntry'
import useAnnotation from '../../hooks/useAnnotation'
import taskSubmitService from '../../services/taskSubmitService'
import EntryHeader from './entry-header/EntryHeader'
import Entry from './entry/Entry'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import "./EntriesSection.css"

const EntriesSection = ({ selectedStatement, taskId, existingExerciseId, onStatementComplete }) => {
  const [statementData, setStatementData] = useState({});
  const [allStatementsData, setAllStatementsData] = useState({});
  const navigate = useNavigate();

  const currentStatementData = selectedStatement ? statementData[selectedStatement.id] : null;
  const entries = currentStatementData?.entries || [];
  const annotations = currentStatementData?.annotations || [];

  useEffect(() => {
    if (selectedStatement && !statementData[selectedStatement.id]) {
      setStatementData((prevData) => ({
        ...prevData,
        [selectedStatement.id]: { entries: [], annotations: [] },
      }));
    }
  }, [selectedStatement]);

  const addEntry = (statementId) => {
    if (!statementData[statementId]) {

      setStatementData((prevData) => ({
        ...prevData,
        [statementId]: { entries: [], annotations: [] },
      }));
    }

    const newEntry = {
      entry_number: statementData[statementId].entries.length + 1,
      entry_date: "2024-10-10",
    };

    setStatementData((prevData) => ({
      ...prevData,
      [statementId]: {
        ...prevData[statementId],
        entries: [...prevData[statementId].entries, newEntry],
      },
    }));
  };

  const removeEntry = (entryNumber) => {
    if (!selectedStatement) return;

    const updatedEntries = entries.filter(entry => entry.entry_number !== entryNumber);
    const updatedAnnotations = annotations.filter((annotation) => annotation.student_entry_id !== entryNumber);

    setStatementData((prevData) => ({
      ...prevData,
      [selectedStatement.id]: {
        entries: updatedEntries,
        annotations: updatedAnnotations,
      },
    }));
  };

  const addAnnotation = (statementId, entryId) => {
    console.log("Agregando anotación para entryId:", entryId);
    if (!statementData[statementId]) {
      setStatementData((prevData) => ({
        ...prevData,
        [statementId]: { entries: [], annotations: [] },
      }));
    }

    const newAnnotation = {
      uid: `annotation-${Date.now()}`,
      student_entry_id: entryId,
      account_id: 1,
      account_number: "",
      debit: 0,
      credit: 0,
    };

    setStatementData((prevData) => ({
      ...prevData,
      [statementId]: {
        ...prevData[statementId],
        annotations: [...prevData[statementId].annotations, newAnnotation],
      },
    }));
  };

  useEffect(() => {
    console.log("Statement Data Actualizado:", statementData);
  }, [statementData]);

  const updateAnnotation = (statementId, annotationUid, updatedAnnotation) => {
    if (!statementId || !statementData[statementId]) return;

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

  const deleteAnnotation = (annotationUid) => {
    if (!selectedStatement) return;

    const updatedAnnotations = annotations.filter((annotation) => annotation.uid !== annotationUid);

    setStatementData((prevData) => ({
      ...prevData,
      [selectedStatement.id]: {
        entries: entries,
        annotations: updatedAnnotations,
      },
    }));
  };

  const handleSubmitStatement = () => {
    if (!selectedStatement) return;

  setAllStatementsData((prevData) => ({
    ...prevData,
    [selectedStatement.id]: { entries, annotations },
  }));

  setStatementData((prevData) => ({
    ...prevData,
    [selectedStatement.id]: { entries: [], annotations: [] },
  }));

  onStatementComplete(selectedStatement.id, { entries, annotations });
  };

  const handleFinalSubmit = () => {
    if (!exercise || !taskId) {
      console.error("El ID del ejercicio no está definido.");
      return;
    }

    const marksAttributes = Object.entries(allStatementsData).map(([statementId, data]) => {
      return {
        statement_id: statementId,
        mark: 5,
        student_entries_attributes: data.entries.map((entry) => ({
          entry_number: entry.entry_number,
          entry_date: entry.entry_date,
          student_annotations_attributes: data.annotations
            .filter((annotation) => annotation.student_entry_id === entry.entry_number)
            .map(({ account_id, account_number, credit, debit }) => ({
              account_id,
              account_number,
              credit: credit || 0,
              debit: debit || 0,
            })),
        })),
      };
    });

    const dataToSubmit = {
      exercise: {
        id: exercise.id,
        task_id: exercise.task.id,
        marks_attributes: marksAttributes,
      },
    };

    taskSubmitService(dataToSubmit, navigate)
      .then(() => {
        console.log("Datos enviados correctamente");
        navigate("/home");
      })
      .catch((err) => {
        console.error("Error al enviar los datos:", err);
      });
  };

  return (
    <div className='entry_container'>
      <EntryHeader addEntry={() => addEntry(selectedStatement.id) } selectedStatement={selectedStatement}/>
      <section className='modes-entries-containner scroll-style'>
        {entries.map((entry, index) => (
              <Entry
                key={entry.entry_number}
                entryIndex={entry.entry_number}
                number={index + 1}
                date={entry.entry_date}
                // markId={entry.mark_id}
                annotations={annotations.filter(
                  (annotation) => annotation.student_entry_id === entry.entry_number
                )}
                updateAnnotation={updateAnnotation}
                deleteAnnotation={(annotationUid) =>
                  deleteAnnotation(selectedStatement.id, annotationUid)
                }
                addAnnotation={(entryId) => addAnnotation(selectedStatement.id, entryId)}
                deleteEntry={removeEntry}
                selectedStatement={selectedStatement}
              />
            ))}
      </section>
      <button onClick={handleSubmitStatement} className='btn light'>Guardar y Continuar</button>
      <button onClick={handleFinalSubmit} className='btn'>
        Enviar Examen
      </button>
    </div >
  )
}

export default EntriesSection
