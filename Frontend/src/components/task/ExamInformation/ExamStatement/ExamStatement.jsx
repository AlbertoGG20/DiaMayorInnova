import { useEffect, useRef, useState } from "react"
import './ExamStatement.css'


const ExamStatement = ({ statement_id, statement_title, index, mark, student_entries, open_statement, handleMarkChange, handleCommentChange, setIsModifiedMark, comment }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isEdition, setIsEdition] = useState(false)
  const [changeMark, setChangeMark] = useState(false)
  const [initialMark, setInitialMark] = useState(mark)
  const statementRef = useRef(null)

  const openMenu = () => {
    setIsOpen(!isOpen)
  }

  const editMenu = () => {
    setIsEdition(!isEdition)
    setIsModifiedMark(true)
    setInitialMark(mark);
  }

  const cancelEdit = () => {
    setIsEdition(false)
    handleMarkChange(statement_id, initialMark);
    setIsModifiedMark(false)
  }

  useEffect(() => {
    if (open_statement.id === statement_id) {
      setIsOpen(true)

      if (statementRef.current) {
        statementRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      } else {
        setIsOpen(false)
      }
    }
  }
    , [open_statement, statement_id])


  return (
    <div className="exam_statement" id={statement_id} ref={statementRef} key={statement_id}>
      <header >
        <div className="exam_statement__container">
          <h3 onClick={openMenu}>Enunciado {index + 1} {isOpen ? <i className="fi fi-rr-angle-small-up"></i> : <i className="fi fi-rr-angle-small-down"></i>}</h3>
          <div className="statement__mark">
            <p onClick={openMenu}>Nota: </p>
            {
              isEdition && isOpen ? (<input type="number" className="exam_statement__input" value={mark} onChange={(e) => { handleMarkChange(statement_id, e.target.value); setChangeMark(false) }} />) : <span>{mark}</span>
            }

            <div className={mark >= 1 ? "status__container green" : (mark < 0.5) ? "status__container red" : "status__container orange"}>
              <i className={mark >= 1 ? "fi fi fi-rr-check" : (mark < 0.5) ? "fi fi fi-rr-x" : "fi fi fi-rr-slash"}></i>
            </div>
          </div>
        </div>
        <p>{statement_title?.definition || 'Sin enunciado'}</p>
      </header >
      {
        isOpen && (
          <div className="statement__entry">
            <h4>Asientos</h4>

            <table>
              <thead>
                <tr>
                  <th className="statement__entry_column">Apt</th>
                  <th className="statement__entry_column">Nº Cuenta</th>
                  <th className="statement__entry_column left-align examen_statement__account_name">Nombre Cuenta</th>
                  <th className="statement__entry_column">Debe</th>
                  <th className="statement__entry_column">Haber </th>
                </tr>
              </thead>
              <tbody>
                {
                  student_entries.map((entry) => (
                    entry.student_annotations.map((annotation, index) => {
                      return (
                        <tr key={annotation.id}>
                          <td className="right-align">{index + 1}</td>
                          <td className="right-align">{annotation.account_number}</td>
                          <td className="left-align examen_statement__account_name">{annotation.account.name}</td>
                          <td className="right-align">{annotation.debit} €</td>
                          <td className="right-align">{annotation.credit} €</td>
                        </tr>
                      )
                    }))
                  )
                }

              </tbody>
            </table>

            {
              isEdition && isOpen && <textarea className="statement__text-area" name="Comment" id="correctionFeedback" value={comment} onChange={(e) => handleCommentChange(statement_id, e.target.value)}></textarea>
            }
            {
              isEdition && isOpen && (
                <div className="btn__container">
                  <button className="btn" onClick={editMenu} disabled={changeMark}>Guardar</button>
                  <button className="btn light" onClick={cancelEdit}>Cancelar</button>

                </div>
              )
            }
            {
              !isEdition && isOpen && <button className="btn" onClick={editMenu}>Editar Nota</button>
            }

          </div>
        )
      }
    </div >
  )
}

export default ExamStatement
