import "./PracticePage.css"
import "../../../components/entries-section/EntriesSection.css"
import EntryHeader from '../../../components/entries-section/entry-header/EntryHeader'
import useEntry from '../../../hooks/useEntry'
import useAnnotation from '../../../hooks/useAnnotation'
import Entry from '../../../components/entries-section/entry/Entry'
import { AuxSection } from '../../../components/aux-section/AuxSection'
import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEYS = {
  ENTRIES: 'practice_entries',
  ANNOTATIONS: 'practice_annotations'
};

const PracticePage = () => {
  const { addEntry: originalAddEntry, removeEntry: originalRemoveEntry } = useEntry();
  const { addAnnotation: originalAddAnnotation, deleteAnnotation: originalDeleteAnnotation, updateAnnotation: originalUpdateAnnotation } = useAnnotation();

  // Estados locales que se sincronizan con localStorage
  const [entries, setEntries] = useState(() => {
    const savedEntries = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    if (savedEntries) {
      return JSON.parse(savedEntries);
    }
    // Si no hay datos guardados, usar el estado inicial
    const initialEntry = {
      entry_number: 1,
      entry_date: "2024-10-10",
      entry_uid: `id-${Math.random().toString(32).substr(2, 9)}`,
    };
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify([initialEntry]));
    return [initialEntry];
  });

  const [annotations, setAnnotations] = useState(() => {
    const savedAnnotations = localStorage.getItem(STORAGE_KEYS.ANNOTATIONS);
    return savedAnnotations ? JSON.parse(savedAnnotations) : [];
  });

  const [formattedEntries, setFormattedEntries] = useState([]);

  // Formatear entradas para la vista
  useEffect(() => {
    const formatted = entries.map(entry => ({
      ...entry,
      annotations: annotations.filter(anno => anno.student_entry_uid === entry.entry_uid)
    }));
    setFormattedEntries(formatted);
  }, [entries, annotations]);

  // Funciones que manejan los cambios y actualizan el estado local y localStorage
  const handleAddEntry = useCallback(() => {
    const newEntry = {
      entry_number: entries.length + 1,
      entry_date: "2024-10-10",
      entry_uid: `id-${Math.random().toString(32).substr(2, 9)}`,
    };
    const newEntries = [...entries, newEntry];
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(newEntries));
    originalAddEntry();
  }, [entries, originalAddEntry]);

  const handleRemoveEntry = useCallback((entryUid) => {
    const newEntries = entries.filter(entry => entry.entry_uid !== entryUid);
    const newAnnotations = annotations.filter(anno => anno.student_entry_uid !== entryUid);
    setEntries(newEntries);
    setAnnotations(newAnnotations);
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(newEntries));
    localStorage.setItem(STORAGE_KEYS.ANNOTATIONS, JSON.stringify(newAnnotations));
    originalRemoveEntry(entryUid);
  }, [entries, annotations, originalRemoveEntry]);

  const handleAddAnnotation = useCallback((entryUid) => {
    const entryAnnotations = annotations.filter(annotation => annotation.student_entry_uid === entryUid);
    const nextAnnotationNumber = entryAnnotations.length + 1;
    const newAnnotation = {
      uid: `id-${Math.random().toString(36).substr(2, 9)}`,
      student_entry_uid: entryUid,
      account_id: 1,
      number: nextAnnotationNumber,
      account_number: "",
      debit: "",
      credit: "",
    };
    const newAnnotations = [...annotations, newAnnotation];
    setAnnotations(newAnnotations);
    localStorage.setItem(STORAGE_KEYS.ANNOTATIONS, JSON.stringify(newAnnotations));
    originalAddAnnotation(entryUid);
  }, [annotations, originalAddAnnotation]);

  const handleDeleteAnnotation = useCallback((annotationUid) => {
    const newAnnotations = annotations.filter(annotation => annotation.uid !== annotationUid);
    setAnnotations(newAnnotations);
    localStorage.setItem(STORAGE_KEYS.ANNOTATIONS, JSON.stringify(newAnnotations));
    originalDeleteAnnotation(annotationUid);
  }, [annotations, originalDeleteAnnotation]);

  const handleUpdateAnnotation = useCallback((statementId, annotationUid, updatedAnnotation) => {
    const newAnnotations = annotations.map(annotation =>
      annotation.uid === annotationUid ? { ...annotation, ...updatedAnnotation } : annotation
    );
    setAnnotations(newAnnotations);
    localStorage.setItem(STORAGE_KEYS.ANNOTATIONS, JSON.stringify(newAnnotations));
    originalUpdateAnnotation(statementId, annotationUid, updatedAnnotation);
  }, [annotations, originalUpdateAnnotation]);

  const handleUpdateEntryDate = useCallback((entryUid, newDate) => {
    const newEntries = entries.map(entry =>
      entry.entry_uid === entryUid ? { ...entry, entry_date: newDate } : entry
    );
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(newEntries));
  }, [entries]);

  const handleClearStorage = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.ENTRIES);
    localStorage.removeItem(STORAGE_KEYS.ANNOTATIONS);
    const initialEntry = {
      entry_number: 1,
      entry_date: "2024-10-10",
      entry_uid: `id-${Math.random().toString(32).substr(2, 9)}`,
    };
    setEntries([initialEntry]);
    setAnnotations([]);
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify([initialEntry]));
  }, []);

  return (
    <div className='modes_page_container practice_color'>
      <h1 className='head_task'>Modo Práctica</h1>


      <div className="entry__container">
        <EntryHeader
          addEntry={handleAddEntry}
          selectedStatement={true}
          examStarted={true}
        />
        <section className='modes-entries-container scroll-style'>
          {
            entries.map((entry, index) => {
              return (
                <Entry
                  key={entry.entry_uid}
                  entryIndex={entry.entry_uid}
                  number={index + 1}
                  date={entry.entry_date}
                  markId={entry.mark_id}
                  annotations={annotations.filter(annotation => annotation.student_entry_uid === entry.entry_uid)}
                  updateAnnotation={handleUpdateAnnotation}
                  deleteAnnotation={handleDeleteAnnotation}
                  addAnnotation={handleAddAnnotation}
                  deleteEntry={handleRemoveEntry}
                  updateEntryDate={handleUpdateEntryDate}
                  exercise={undefined}
                />
              )
            })
          }
        </section>
        <div className="modes-entries-container--buttons">
          <button
            className="btn btn-secondary"
            onClick={handleClearStorage}
            aria-label="Limpiar datos guardados"
          >
            Limpiar datos guardados
          </button>
        </div>
      </div>
      <AuxSection
        helpAvailable={true}
        entries={formattedEntries}
      />
    </div>
  )
}

export default PracticePage
