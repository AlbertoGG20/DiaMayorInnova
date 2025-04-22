import { useEffect, useState } from 'react'
import "./Entry.css"
import EntryForm from './entry-form/EntryForm'

const Entry = ({ number, updateEntryDate, annotations, updateAnnotation, deleteAnnotation, addAnnotation, deleteEntry, entryIndex, selectedStatement, date, exercise }) => {
  const [entryStatus, setEntryStatus] = useState(false);
  const [entryDate, setDate] = useState(date || "2024-10-10");
  const formattedDate = new Date(`${entryDate}T00:00:00`).toLocaleDateString("es-ES");
  const [total, setTotal] = useState(0);

  const changeStatus = () => {
    setEntryStatus(!entryStatus)
  }

  const handleChangeDate = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    if (selectedStatement) {
      updateEntryDate(selectedStatement.id, entryIndex, newDate);
    }
  }

  const calculateTotal = () => {
    let total = 0;
    annotations.map((annotation) => {
      total += annotation.debit;
      total -= annotation.credit;
    })
    return total;
  }

  useEffect(() => {
    setTotal(calculateTotal())
  }, [annotations])

  return (
    <div className='entry_wrapper'>
      <div className="entry_head" tabIndex={0} onKeyDown={changeStatus}>
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
            disabled={exercise?.finished || false}
          />
          <p className='entry_total'>Total: <span>{total}</span></p>
        </div>
        
        <button 
          className='btn-trash' 
          aria-label='Eliminar asiento' 
          onClick={() => deleteEntry(entryIndex)}
          disabled={exercise?.finished || false}
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
            .map((annotation, index) => {
              return (
                <EntryForm
                  key={annotation.uid}
                  aptNumber={index + 1}
                  annotation={annotation}
                  onDelete={() => deleteAnnotation(annotation.uid)}
                  updateAnnotation={(updatedAnnotation) => updateAnnotation(selectedStatement?.id ?? 0, annotation.uid, updatedAnnotation)}
                  exercise={exercise}
                />
              );
            })}
          </div>

          {entryStatus &&
            <button
              className='btn entry_add_annotation'
              onClick={() => addAnnotation(entryIndex)}
              disabled={exercise?.finished || false}
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
