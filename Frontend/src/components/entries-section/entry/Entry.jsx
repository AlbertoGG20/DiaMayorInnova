import { useEffect, useState, useMemo } from 'react'
import "./Entry.css"
import EntryForm from './entry-form/EntryForm'
import { getCurrentDate } from '../../../utils/dateUtils'

const Entry = ({ number, updateEntryDate, annotations, updateAnnotation, deleteAnnotation, addAnnotation, deleteEntry, entryIndex, selectedStatement, date, exercise, observations: initialObservations }) => {
  const [entryStatus, setEntryStatus] = useState(exercise?.finished);
  const [entryDate, setEntryDate] = useState(date || getCurrentDate());
  const [observations, setObservations] = useState(initialObservations || "");
  const formattedDate = new Date(`${entryDate}T00:00:00`).toLocaleDateString("es-ES");

  useEffect(() => {
    setObservations(initialObservations || "");
  }, [initialObservations]);

  const total = useMemo(() => {
    return annotations.reduce((acc, annotation) => {
      const debit = parseFloat(annotation.debit) || 0;
      const credit = parseFloat(annotation.credit) || 0;
      return acc + debit - credit;
    }, 0);
  }, [annotations]);

  const formattedTotal = useMemo(() => {
    return total.toFixed(2);
  }, [total]);

  const changeStatus = () => {
    setEntryStatus(!entryStatus)
  }

  const handleChangeDate = (e) => {
    const newDate = e.target.value;
    setEntryDate(newDate);
    if (selectedStatement) {
      updateEntryDate(selectedStatement.id, entryIndex, newDate, observations);
    }
  }

  const handleObservationsChange = (e) => {
    const newObservations = e.target.value;
    setObservations(newObservations);
    if (selectedStatement) {
      updateEntryDate(selectedStatement.id, entryIndex, entryDate, newObservations);
    }
  }

  useEffect(() => {
    if (date) {
      setEntryDate(date);
    }
  }, [date]);

  useEffect(() => {
    if (entryDate !== date) {
      if (selectedStatement) {
        updateEntryDate(selectedStatement.id, entryIndex, entryDate);
      } else {
        updateEntryDate(entryIndex, entryDate);
      }
    }
  }, [entryDate]);

  return (
    <div className='entry_wrapper'>
      <div className="entry_head">
        <div className="head_tittle" onClick={() => setEntryStatus(!entryStatus)} >
          <p>Asiento {number}</p>
          <i className={entryStatus ? 'fi fi-rr-angle-small-up' : 'fi fi-rr-angle-small-down'}></i>
        </div>
        <div className="head_data">
          <input
            aria-label='Fecha del asiento'
            type='date'
            className='date_input'
            value={entryDate}
            onChange={handleChangeDate}
            disabled={exercise?.finished}
            onClick={(e) => e.stopPropagation()}
          />
          <p className='entry_total'>Total: <span>{formattedTotal}</span></p>
        </div>

        <button
          className='btn-trash'
          aria-label='Eliminar asiento'
          onClick={(e) => {
            e.stopPropagation();
            deleteEntry(entryIndex);
          }}
          disabled={exercise?.finished}
        >
          <i className='fi fi-rr-trash'></i>
        </button>
      </div>

      {selectedStatement && (
        <div className="statement-info">
          <h4>Enunciado Seleccionado:</h4>
          <p>{selectedStatement.definition}</p>
        </div>
      )}

      {entryStatus && (
        <div className="entry_body">
          <section className="entry_body_tittle">
            <header className="header_container">
              <p className='apt_number'>Apt</p>
              <div className="tittles_wrapper">
                <p className='tittle_account-number' id='tittle_account-number'>Nº Cuenta</p>
                <p className='tittle_account-name tittle_account-name--no-visible' id='tittle_account-name'>Nombre Cuenta</p>
                <p className='tittle_debit' id='tittle_debit'>Debe</p>
                <p className='tittle_credit' id='tittle_credit'>Haber</p>
              </div>
            </header>
          </section>

          <div className="entry_item_container scroll-style">
            {annotations
            .filter(anno => !anno._destroy)
            .sort((a, b) => a.number - b.number)
            .map((annotation) => {
              return (
                <EntryForm
                  key={annotation.uid}
                  annotation={annotation}
                  onDelete={() => deleteAnnotation(annotation.uid)}
                  updateAnnotation={(updatedAnnotation) => updateAnnotation(selectedStatement?.id ?? 0, annotation.uid, updatedAnnotation)}
                  exercise={exercise}
                />
              );
            })}
          </div>

          <div className="entry_observations">
            <textarea
              placeholder="Observaciones..."
              value={observations}
              onChange={handleObservationsChange}
              disabled={exercise?.finished}
              className="entry_observations_textarea"
            />
          </div>

          {entryStatus &&
            <button
              className='btn entry_add_annotation'
              onClick={() => addAnnotation(entryIndex)}
              disabled={exercise?.finished}
              >
              <i className='fi fi-rr-plus'></i>
              Apunte
            </button>
          }
        </div>
      )
      }
    </div >
  )
}

export default Entry
