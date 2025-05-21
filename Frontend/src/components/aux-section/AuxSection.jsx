import { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import AuxSectionTwo from '../aux-section-two/AuxSectionTwo'
import HelpSection from '../help-section/HelpSection'
import RealTimeTrialBalance from '../trial-balance/RealTimeTrialBalance'
import LedgerBook from '../trial-balance/LedgerBook'
import '../../pages/modes/practice-page/PracticePage.css'
import '../../components/entries-section/EntriesSection.css'
import './AuxSection.css'

export const AuxSection = ({
  statements,
  examStarted,
  onSelectStatement,
  helpAvailable = false,
  entries = [],
  selectedStatement
}) => {
  const route = useLocation().pathname

  const showHelpTab = useMemo(() => helpAvailable && !route.includes('/modes/examen/'), [helpAvailable, route]);
  const showStatementsTab = useMemo(() => !route.includes('/modes/practica'), [route]);

  const getDefaultTab = () => {
    if (showHelpTab) return 'help_example';
    if (showStatementsTab) return 'statements';
    return 'balance';
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab());

  useEffect(() => {
    setActiveTab(getDefaultTab());
  }, [showHelpTab, showStatementsTab]);

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'statements':
        return (
          <AuxSectionTwo
            statements={statements}
            examStarted={examStarted}
            onSelectStatement={onSelectStatement}
          />
        );
      case 'help_example':
        if (!selectedStatement) {
          return <div>Selecciona un enunciado para ver la ayuda</div>;
        }
        return <HelpSection statementId={selectedStatement.id} />;
      case 'balance':
        return <RealTimeTrialBalance entries={entries} />;
      case 'mayor':
        return <LedgerBook entries={entries} />;
      default:
        return null;
    }
  }, [activeTab, entries, examStarted, onSelectStatement, selectedStatement, statements]);

  return (
    <div className='practice__section_2'>
      <div className='section_2__tab_buttons'>
        {showHelpTab && (
          <button
            className={`btn__tabs ${activeTab === 'help_example' ? 'btn__tabs--active' : ''}`}
            onClick={() => setActiveTab('help_example')}
          >
            Ayuda
          </button>
        )}
        {showStatementsTab && (
          <button
            className={`btn__tabs ${activeTab === 'statements' ? 'btn__tabs--active' : ''}`}
            onClick={() => setActiveTab('statements')}
          >
            Enunciados
          </button>
        )}
        <button
          className={`btn__tabs ${activeTab === 'mayor' ? 'btn__tabs--active' : ''}`}
          onClick={() => setActiveTab('mayor')}
        >
          Diario Mayor
        </button>
        <button
          className={`btn__tabs ${activeTab === 'balance' ? 'btn__tabs--active' : ''}`}
          onClick={() => setActiveTab('balance')}
        >
          Balance
        </button>
      </div>
      {tabContent}
    </div>
  );
}