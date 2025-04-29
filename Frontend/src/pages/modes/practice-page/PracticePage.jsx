import "./PracticePage.css"
import "../../../components/entries-section/EntriesSection.css"
import EntryHeader from '../../../components/entries-section/entry-header/EntryHeader'
import useEntry from '../../../hooks/useEntry'
import useAnnotation from '../../../hooks/useAnnotation'
import Entry from '../../../components/entries-section/entry/Entry'
import { AuxSection } from '../../../components/aux-section/AuxSection'
import { useState, useEffect } from 'react'

const PracticePage = () => {
  const { addEntry, removeEntry, entries } = useEntry();
  const { addAnnotation, deleteAnnotation, updateAnnotation, annotations } = useAnnotation();
  const [formattedEntries, setFormattedEntries] = useState([]);

  useEffect(() => {
    const formatted = entries.map(entry => ({
      ...entry,
      annotations: annotations.filter(anno => anno.student_entry_uid === entry.entry_uid)
    }));
    setFormattedEntries(formatted);
  }, [entries, annotations]);

  return (
    <div className='modes_page_container practice_color'>
      <h1 className='head_task'>Modo Tarea</h1>

      <div className="entry__container">
        <EntryHeader
          addEntry={addEntry}
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
                  updateAnnotation={updateAnnotation}
                  deleteAnnotation={deleteAnnotation}
                  addAnnotation={addAnnotation}
                  deleteEntry={removeEntry}
                  exercise={undefined}
                />
              )
            })
          }
        </section>
      </div>
      <AuxSection
        helpAvailable={true}
        entries={formattedEntries}
      />
    </div>
  )
}

export default PracticePage
