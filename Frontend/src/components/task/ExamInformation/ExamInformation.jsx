import { useNavigate, useParams } from "react-router-dom";
import "./ExamInformation.css"
import ExamStatement from "./ExamStatement/ExamStatement"
import { useEffect, useState } from "react";
import "../../aux-section-two/AuxSectionTwo.css"
import exerciseServices from "../../../services/exerciseServices";
import marksServices from "../../../services/marksServices";
import RealTimeTrialBalance from "../../trial-balance/RealTimeTrialBalance";
import LedgerBook from "../../trial-balance/LedgerBook";
import ButtonBack from "../../button-back/ButtonBack";
import Breadcrumbs from "../../breadcrumbs/Breadcrumbs";

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
  const [activeTab, setActiveTab] = useState("statements");

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

  const renderContent = () => {
    switch (activeTab) {
      case "statements":
        return (
          <div className="exam_statement__list">
            {(statements.length > 0) ?
              statements.map((mark, index) => {
                console.log("mark", mark)
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
        );
      case "mayor":
        return (
          <div className="exam_statement__list">
            <LedgerBook
              entries={statements.flatMap(statement =>
                statement.student_entries?.map(entry => ({
                  ...entry,
                  annotations: entry.student_annotations
                })) || []
              )}
            />
          </div>
        );
      case "balance":
        return (
          <RealTimeTrialBalance
            entries={statements.flatMap(statement =>
              statement.student_entries?.map(entry => ({
                ...entry,
                annotations: entry.student_annotations
              })) || []
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="exam_statements">
      <header className="exam_statements__header">
        <ButtonBack />
        <Breadcrumbs />
      </header>
      <main className="exam_statements__main">
        <h2 className="exam_statement__statement">
          {activeTab === "statements" ? "Enunciados" :
            activeTab === "mayor" ? "Diario Mayor" :
              "Balance"}
        </h2>
        <div className="exam_statements__container">
          {activeTab === "statements" && (
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
          )}
          {activeTab === "balance" && (
            <div className="exam_statement__list">
              <RealTimeTrialBalance
                entries={statements.flatMap(statement =>
                  statement.student_entries?.map(entry => ({
                    ...entry,
                    annotations: entry.student_annotations
                  })) || []
                )}
              />
            </div>
          )}
          {activeTab === "mayor" && (
            <div className="exam_statement__list">
              <LedgerBook
                entries={statements.flatMap(statement =>
                  statement.student_entries?.map(entry => ({
                    ...entry,
                    annotations: entry.student_annotations
                  })) || []
                )}
              />
            </div>
          )}

          <div className="exam-statement__information">
            <div className="tabs-container">
              <button
                className={`btn__tabs ${activeTab === "statements" ? "btn__tabs--active" : ""}`}
                onClick={() => setActiveTab("statements")}
              >
                Enunciados
              </button>
              <button
                className={`btn__tabs ${activeTab === "mayor" ? "btn__tabs--active" : ""}`}
                onClick={() => setActiveTab("mayor")}
              >
                Mayor
              </button>
              <button
                className={`btn__tabs ${activeTab === "balance" ? "btn__tabs--active" : ""}`}
                onClick={() => setActiveTab("balance")}
              >
                Balance
              </button>
            </div>
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
