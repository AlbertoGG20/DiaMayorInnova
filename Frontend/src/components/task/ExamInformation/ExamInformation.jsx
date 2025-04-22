import { useNavigate, useParams } from "react-router-dom";
import "./ExamInformation.css"
import ExamStatement from "./ExamStatement/ExamStatement"
import { useEffect, useState } from "react";
import "../../aux-section-two/AuxSectionTwo.css"
import exerciseServices from "../../../services/exerciseServices";
import marksServices from "../../../services/marksServices";

const ExamInformation = () => {
  const navigate = useNavigate();
  const { exerciseId } = useParams();
  const [statements, setStatements] = useState([]);
  const [selectedStatement, setSelectedStatement] = useState(0);
  const [visitedStatements, setVisitedStatements] = useState([]);
  const [name, setName] = useState("");
  const [studentExercise, setStudentExercise] = useState([]);
  const [isModifiedMark, setIsModifiedMark] = useState(false);
  const [totalMark, setTotalMark] = useState(0);
  const [correctStatements, setCorrectStatements] = useState(0);
  const [incorrectStatements, setIncorrectStatements] = useState(0);
  const [incompleteStatements, setIncompleteStatements] = useState(0);

  const handleStatementClick = (statement) => {
    if (!visitedStatements.includes(statement.id)) {
      setVisitedStatements([...visitedStatements, statement.id]);
    }
    setSelectedStatement(statement);
  };

  const handleMarkChange = (statement_id, newMark) => {
    setStatements((prevStatements) => {
      const updatedStatements = prevStatements.map((statement) =>
        statement.id === statement_id ? { ...statement, mark: newMark } : statement
      );

      setIsModifiedMark(true);
      return updatedStatements;
    });
  };

  const handleCommentChange = (statement_id, newComment) => {
    setStatements((prevStatements) => {
      const updatedStatements = prevStatements.map((statement) =>
        statement.id === statement_id ? { ...statement, comment: newComment } : statement
      );

      setIsModifiedMark(true);
      return updatedStatements;
    });
  }

  const calculateTotalMark = () => {  //Same calc as in the backend method TotalMark
    if (!statements || statements.length === 0) return 0;

    const totalScore = statements.reduce((sum, s) => sum + (parseFloat(s.mark) || 0), 0);
    const maxPossibleScore = statements.length;
    const normalizedScore = (totalScore / maxPossibleScore) * 10;

    return Math.round(Math.min(normalizedScore, 10) * 10) / 10;
  };

  const calculateStats = () => {
    if (!statements || statements.length === 0) {
      setTotalMark(0);
      setCorrectStatements(0);
      setIncorrectStatements(0);
      setIncompleteStatements(0);
      return;
    }

    let totalScore = 0;
    let correct = 0;
    let incorrect = 0;
    let incomplete = 0;

    statements.forEach((s) => {
      const mark = parseFloat(s.mark) || 0;
      totalScore += mark;

      if (mark >= 1) {
        correct++;
      } else if (mark < 0.5) {
        incorrect++;
      } else {
        incomplete++;
      }
    });

    const maxPossibleScore = statements.length;
    const normalizedScore = (totalScore / maxPossibleScore) * 10;
    const finalMark = Math.round(Math.min(normalizedScore, 10) * 10) / 10;

    setTotalMark(finalMark);
    setCorrectStatements(correct);
    setIncorrectStatements(incorrect);
    setIncompleteStatements(incomplete);
  };

  const updateExercise = () => {
    const formateData = statements.map((statement) => ({
      id: statement.id,
      mark: statement.mark,
      comment: statement.comment
    }))

    marksServices.manual_update_mark(formateData)
      .then(response => {
        if (response) {
          console.log("Respuesta de la actualización:", response);
        } else {
          console.error("Error al actualizar las marcas.");
        }
      });
  }

  useEffect(() => {
    exerciseServices.getByExerciseId(exerciseId)
      .then(({ data }) => {
        setName(data[0].user.name)
        setStatements(data[0].marks)
        setStudentExercise(data[0])
      })
      .catch(error => {
        console.error(error)
      })
  }, [exerciseId])


  useEffect(() => {
    setTotalMark(calculateTotalMark());
    calculateStats();
  }, [statements]);



  return (
    <div className="exam_statements">
      <header className="exam_statements__header">
        <button className="btn light" onClick={() => navigate(-1)}> <i className="fi fi-rr-arrow-small-left"></i> </button>
        <h1 className="exam_statements__title">{name}</h1>
      </header>
      <main className="exam_statements__main">
        <h2 className="exam_statement__statement">Enunciados</h2>
        <div className="exam_statements__container">

          <div className="exam_statement__list">
            {(statements.length > 0) ?
              statements.map((mark, index) => {
                return (
                  <ExamStatement
                    key={mark.id}
                    statement_title={mark.statement}
                    statement_id={mark.id}
                    index={index}
                    mark={mark.mark}
                    comment={mark.comment}
                    student_entries={mark.student_entries}
                    open_statement={selectedStatement}
                    handleMarkChange={handleMarkChange}
                    modified={isModifiedMark}
                    setIsModifiedMark={setIsModifiedMark}
                    handleCommentChange={handleCommentChange}
                  />
                )
              }) : <p className="exam_statements__empty">No hay respuestas</p>
            }
          </div>

          <div className="exam-statement__information">
            <div className="statement-grid">
              {statements.map((statement, index) => {
                let buttonClass = "statement-button";
                if (selectedStatement?.id === statement.id) {
                  buttonClass += " selected_mark";
                }
                return (
                  <button
                    key={statement.id}
                    className={statement.mark >= 1 ? `${buttonClass} green` : (statement.mark < 0.5) ? `${buttonClass} red` : `${buttonClass} orange`}
                    onClick={() => handleStatementClick(statement)}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div className="exam_information">
              <h3>Resumen Examen</h3>
              <div className="exam_information__data">
                <p>Enunciados Correctos: {correctStatements}</p>
                <p>Enunciados Incorrectos: {incorrectStatements}</p>
                <p>Enunciados Incompletos: {incompleteStatements}</p>
              </div>

              <h4>Nota Examen: {studentExercise.total_mark}</h4>
              {isModifiedMark && <h4>Nota Modificada: {totalMark}</h4>}
            </div>
          </div>
        </div>
        <div className="btn__container">
          <button className="btn" onClick={updateExercise} disabled={!isModifiedMark} >Guardar Corrección</button>
          <button className="btn light" onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </main>
    </div>
  )
}

export default ExamInformation
