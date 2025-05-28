import { useEffect, useCallback, useMemo } from 'react'
import { getItemsArrayFromSessionStorage, setItemsOnSessionStorage } from '../../../utils/sessionStorage'
import useAnnotation from '../../../hooks/useAnnotation'
import useEntry from '../../../hooks/useEntry'
import { AuxSection } from '../../../components/aux-section/AuxSection'
import EntryHeader from '../../../components/entries-section/entry-header/EntryHeader'
import Entry from '../../../components/entries-section/entry/Entry'
import '../../../components/entries-section/EntriesSection.css'
import './PracticePage.css'

const STORAGE_KEYS = {
  ENTRIES: 'practice_entries',
  ANNOTATIONS: 'practice_annotations'
};

const PracticePage = () => {

  const {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    clearEntries,
  } = useEntry(getItemsArrayFromSessionStorage(STORAGE_KEYS.ENTRIES));

  const {
    annotations,
    setAnnotations,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    clearAnnotations,
  } = useAnnotation(getItemsArrayFromSessionStorage(STORAGE_KEYS.ANNOTATIONS));

  // Sync state to session storage
  useEffect(() => setItemsOnSessionStorage(STORAGE_KEYS.ENTRIES, entries), [entries]);
  useEffect(() => setItemsOnSessionStorage(STORAGE_KEYS.ANNOTATIONS, annotations), [annotations]);

  const handleDeleteEntry = useCallback((entryUid) => {
    deleteEntry(entryUid);
    const newAnnotations = annotations.filter(annotation => annotation.student_entry_uid !== entryUid);
    setAnnotations(newAnnotations);
  }, [annotations, deleteEntry, setAnnotations]);

  const handleClearStorage = useCallback(() => {
    clearEntries();
    clearAnnotations();
  }, [clearEntries, clearAnnotations]);

  // sync student entry annotations to each entry
  const formattedEntries = useMemo(
    () =>
      entries.map(entry => ({
        ...entry,
        annotations: annotations.filter(a => a.student_entry_uid === entry.entry_uid)
      })),
    [entries, annotations]
  );

  return (
    <div className='modes_page_container practice_color'>
      <h1 className='head_task'>Modo Práctica</h1>

      <div className='entry__container'>
        <EntryHeader
          addEntry={addEntry}
          selectedStatement={true}
          examStarted={true}
        />
        <section className='modes-entries-container scroll-style'>
          {formattedEntries.map((entry, index) =>
            <Entry
              key={entry.entry_uid}
              entryIndex={entry.entry_uid}
              number={index + 1}
              date={entry.entry_date}
              markId={entry.mark_id}
              updateEntryDate={(entryUid, newDate) =>
                updateEntry(entryUid, {entry_date: newDate})
              }
              deleteEntry={handleDeleteEntry}
              annotations={entry.annotations}
              addAnnotation={addAnnotation}
              updateAnnotation={(_statementId, annotationUid, updatedAnnotation) =>
                updateAnnotation(annotationUid, updatedAnnotation)
              }
              deleteAnnotation={deleteAnnotation}
              exercise={undefined}
            />
          )}
        </section>
        <div className='modes-entries-container--buttons'>
          <button
            className='btn btn-secondary'
            onClick={handleClearStorage}
            aria-label='Limpiar datos guardados'
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
