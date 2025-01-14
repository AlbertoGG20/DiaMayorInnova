import { useEffect, useState } from 'react'
import "./Entry.css"
import EntryForm from './entry-form/EntryForm'

const Entry = ({ number, date = "2024-10-10", annotations, updateAnnotation, deleteAnnotation, addAnnotation, deleteEntry, entryIndex }) => {
  const [entryStatus, setEntryStatus] = useState(false);
  const [entrydate, setDate] = useState(date);
  const formattedDate = new Date(`${entrydate}T00:00:00`).toLocaleDateString("es-ES");
  const [total, setTotal] = useState(0);

  const changeStatus = () => {
    setEntryStatus(!entryStatus)
  }

  const handleChangeDate = (e) => {
    setDate(e.target.value)
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
      <header className="entry_head" >
        <div className="head_tittle" onClick={changeStatus} >
          <p>Asiento {number}</p>
          <i className={entryStatus ? 'fi fi-rr-angle-small-up' : 'fi fi-rr-angle-small-down'}></i>
        </div>
        <div className="head_data">
          {entryStatus ?
            <input type='date' className='date_input' value={entrydate} onChange={handleChangeDate}></input>
            : <p>Fecha: <span>{formattedDate}</span></p>
          }
          <p>Total: <span>{total}</span></p>
        </div>
        <button className='btn-trash' onClick={() => deleteEntry(entryIndex)}><i className='fi fi-rr-trash'></i></button>
      </header >
      {
        entryStatus && (
          <div className="entry_body">
            <section className="entry_body_tittle">
              <header className="header_container">
                <p className='apt_number'>Apt</p>
                <div className="tittles_wrapper">
                  <p className='tittle_account-number'>Nº Cuenta</p>
                  <p className='tittle_account-name'>Nombre Cuenta</p>
                  <p className='tittle_debit'>Debe</p>
                  <p className='tittle_credit'>Haber</p>
                </div>
              </header>

            </section>

            <div className="entry_item_container scroll-style">
              {annotations && annotations.map((annotation, index) => (
                <EntryForm
                  key={annotation.uid}
                  aptNumber={index + 1}
                  annotation={annotation}
                  onDelete={() => deleteAnnotation(annotation.uid)}
                  updateAnnotation={(updatedAnnotation) => updateAnnotation(annotation.uid, updatedAnnotation)}
                />
              ))
              }
            </div>
            {
              entryStatus &&
              <button
                className='btn entry_add_annotation'
                onClick={() => addAnnotation(entryIndex)}>
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
