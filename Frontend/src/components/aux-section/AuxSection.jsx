import React, { useState, useEffect, useMemo } from 'react'
import AuxSectionTwo from '../aux-section-two/AuxSectionTwo.jsx'
import HelpSection from '../help-section/HelpSection'
import RealTimeTrialBalance from '../trial-balance/RealTimeTrialBalance'
import LedgerBook from '../trial-balance/LedgerBook'
import "./AuxSection.css"
import "../../components/entries-section/EntriesSection.css"
import "../../pages/modes/practice-page/PracticePage.css"
import { useLocation } from 'react-router-dom'

export const AuxSection = ({ statements, examStarted, onSelectStatement, helpAvailable = false, entries = [] }) => {
  const route = useLocation().pathname
  const [auxSection, setAuxSection] = useState("help_example")
  const isExam = route.includes("/modes/examen/");

  const sectionAux = useMemo(() => {
    switch (auxSection) {
      case "statements":
        return (
          <AuxSectionTwo
            statements={statements}
            examStarted={isExam ? examStarted : true}
            onSelectStatement={onSelectStatement}
          />
        );
      case "help_example":
        return <HelpSection />;
      case "balance":
        return <RealTimeTrialBalance entries={entries} />;
      case "mayor":
        return <LedgerBook entries={entries} />;
      default:
        return null;
    }
  }, [auxSection, statements, examStarted, onSelectStatement, entries, isExam]);

  const changeAuxSection = (section) => {
    setAuxSection(section);
  }

  return (
    <div className="practice__section_2">
      <div className="section_2__tab_buttons">
        {
          (!isExam && helpAvailable) &&
          (<button className={auxSection === "help_example" ? 'btn__tabs--radius btn__tabs  btn__tabs--active' : 'btn__tabs btn__tabs--radius'} onClick={() => changeAuxSection("help_example")}>Ayuda</button>)
        }
        {
          route !== "/modes/practica" &&
          (<button className={auxSection === "statements" ? 'btn__tabs btn__tabs--active' : 'btn__tabs'} onClick={() => changeAuxSection("statements")}>Enunciados</button>)
        }
        <button className={auxSection === "mayor" ? 'btn__tabs btn__tabs--active' : 'btn__tabs'} onClick={() => changeAuxSection("mayor")}>Diario Mayor</button>
        <button className={auxSection === "balance" ? 'btn__tabs btn__tabs--active' : 'btn__tabs'} onClick={() => changeAuxSection("balance")}>Balance</button>
      </div>
      {sectionAux}
    </div>
  )
}