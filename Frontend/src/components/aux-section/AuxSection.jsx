import React, { useState } from 'react'
import AuxSectionTwo from '../aux-section-two/AuxSectionTwo.jsx'
import HelpSection from '../help-section/HelpSection'
import "./AuxSection.css"
import "../../components/entries-section/EntriesSection.css"
import "../../pages/modes/practice-page/PracticePage.css"
import { useLocation } from 'react-router-dom'

export const AuxSection = ({ statements, examStarted, onSelectStatement, helpAvailable = false }) => {
  const route = useLocation().pathname
  const [auxSection, setAuxSection] = useState("balance")
  let [sectionAux, setSectionAux] = useState(<div>Balance</div>);

  const changeAuxSection = (section) => {
    switch (section) {
      case "statements":
        setSectionAux(
          <AuxSectionTwo
            statements={statements}
            examStarted={examStarted}
            onSelectStatement={onSelectStatement}
          />)
        setAuxSection("statements")
        break;

      case "help_example":
        setSectionAux(<HelpSection />)
        setAuxSection("help_example")
        break;

      case "balance":
        setSectionAux(<div>Pestaña Balance</div>)
        setAuxSection("balance")
        break;

      default:
        setSectionAux(<div>Pestaña Diario Mayor</div>)
        setAuxSection("mayor")
        break;
    }
  }

  return (
    <div className="practice__section_2">
      <div className="section_2__tab_buttons">
        {
          (!route.includes("/modes/examen/") && helpAvailable) &&
          (<button className={auxSection === "help_example" ? 'btn__tabs--radius btn__tabs  btn__tabs--active' : 'btn__tabs btn__tabs--radius'} onClick={() => changeAuxSection("help_example")}>Ayuda</button>)
        }
        {
          route !== "/modes/practica" &&
          (<button className={auxSection === "statements" ? 'btn__tabs btn__tabs--active' : 'btn__tabs'} onClick={() => changeAuxSection("statements")}>Enunciados</button>)
        }
        <button className={auxSection === "mayor" ? 'btn__tabs btn__tabs--active' : 'btn__tabs'} onClick={() => changeAuxSection("mayor")}>Diario Mayor</button>
        <button className={auxSection === "balance" ? 'btn__tabs btn__tabs--active' : 'btn__tabs'} onClick={() => changeAuxSection("balance")}>Balance</button>
      </div>
      {
        sectionAux
      }
    </div >
  )
}
