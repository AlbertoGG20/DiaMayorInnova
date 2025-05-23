import { useState, useEffect } from 'react';
import Spinner from '../spinners/Spinner';
import solutionService from '../../services/solutionService';
import "./HelpSection.css"

const HelpSection = ({statementId}) => {
  const [solution, setSolution] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isEntriesExpanded, setIsEntriesExpanded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isAccountsExpanded, setIsAccountsExpanded] = useState(false);

  useEffect(() => {
    const fetchExampleSolution = async () => {
      if (!statementId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await solutionService.getExampleSolution(statementId);
        if (response && response.data) {
          setSolution(response.data);
        } else {
          setIsError(true);
        }
      } catch (error) {
        console.error("Error al obtener la solución de ejemplo:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExampleSolution();
  }, [statementId]);

  const toggleAllEntries = () => {
    setIsEntriesExpanded(!isEntriesExpanded);
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const toggleAccounts = () => {
    setIsAccountsExpanded(!isAccountsExpanded);
  };

  // Extraer información única de las cuentas
  const getUniqueAccounts = () => {
    if (!solution?.entries) return [];
    const accounts = new Map();
    
    solution.entries.forEach(entry => {
      entry.annotations?.forEach(annotation => {
        if (annotation.account) {
          accounts.set(annotation.account.account_number, {
            ...annotation.account,
            account_number: annotation.account.account_number,
            description: annotation.account.description,
            charge: annotation.account.charge,
            credit: annotation.account.credit
          });
        }
      });
    });
    
    return Array.from(accounts.values());
  };

  if (isLoading) {
    return (
      <section className="section-one_loader">
        <Spinner />
      </section>
    );
  }

  if (isError) {
    return (
      <section className='help_section__container'>
        <p className='text-error-feedback'>Error al cargar la solución de ejemplo</p>
      </section>
    );
  }

  if (!solution) {
    return (
      <section className='help_section__container'>
        <p>No hay solución de ejemplo disponible para este enunciado</p>
      </section>
    );
  }

  const uniqueAccounts = getUniqueAccounts();

  return (
    <section className='help_section__container'>
      <h2 className='help_section_title'>Ejemplo de solución</h2>
      <div className="help_section__solution_info scroll-style">
        <div className="help_section__solution--description">
          <div 
            className="help_section__header"
            onClick={toggleDescription}
          >
            <h4 className='help_section__lead'>Descripción</h4>
            <button className="help_section__expand_button">
              <i className={`fi fi-rr-angle-${isDescriptionExpanded ? 'up' : 'down'}`}></i>
            </button>
          </div>
          {isDescriptionExpanded && (
            <div className="help_section__solution--description-content">
              <p>{solution.description}</p>
            </div>
          )}
        </div>

        <div className="help_section__solution--entries">
          <div 
            className="help_section__header"
            onClick={toggleAllEntries}
          >
            <h4 className='help_section__lead'>Asientos</h4>
            <button className="help_section__expand_button">
              <i className={`fi fi-rr-angle-${isEntriesExpanded ? 'up' : 'down'}`}></i>
            </button>
          </div>

          {isEntriesExpanded && (
            <div className="help_section__solution--entries-list">
              {solution.entries && solution.entries.map((entry, index) => (
                <div key={index} className="help_section__entry_info">
                  <div className="help_section__header">
                    <div className="help_section__head_tittle">
                      <h4 className='help_section__lead'>Asiento {entry.entry_number}</h4>
                      <p className="help_section__entry_date">Fecha: {entry.entry_date}</p>
                    </div>
                  </div>
                  <div className="help_section__solution--entry-body">
                    <section className="help_section__solution--entry-body-title">
                      <header className="help_section__header_container">
                        <p className='help_section__apt_number'>Apt</p>
                        <div className="help_section__tittles_wrapper">
                          <p className='help_section__tittle_account-number' id='tittle_account-number'>Nº Cuenta</p>
                          <p className='help_section__tittle_account-name help_section__tittle_account-name--no-visible' id='tittle_account-name'>Nombre Cuenta</p>
                          <p className='help_section__tittle_debit' id='tittle_debit'>Debe</p>
                          <p className='help_section__tittle_credit' id='tittle_credit'>Haber</p>
                        </div>
                      </header>
                    </section>

                    <div className="help_section__entry_item_container scroll-style">
                      {entry.annotations && entry.annotations.map((annotation, annIndex) => (
                        <div key={annIndex} className="help_section__entry_form_wrapper">
                          <p className='help_section__apt_number'>{annIndex + 1}</p>
                          <div className="help_section__entry_form">
                            <div className="help_section__entry_form_inputs__wrapper">
                              <div className="help_section__form_group help_section__account_number_group">
                                <span className="help_section__account_number">{annotation.account?.account_number}</span>
                              </div>
                              <div className="help_section__form_group help_section__account_name_group">
                                <span className="help_section__account_name">{annotation.account?.name || ''}</span>
                              </div>
                              <div className="help_section__form_group help_section__debit_group">
                                <span className="help_section__debit_value">{annotation.debit || ''} €</span>
                              </div>
                              <div className="help_section__form_group help_section__credit_group">
                                <span className="help_section__credit_value">{annotation.credit || ''} €</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="help_section__info-accounts">
          <div 
            className="help_section__header"
            onClick={toggleAccounts}
          >
            <h4 className='help_section__lead'>Información de las Cuentas</h4>
            <button className="help_section__expand_button">
              <i className={`fi fi-rr-angle-${isAccountsExpanded ? 'up' : 'down'}`}></i>
            </button>
          </div>

          {isAccountsExpanded && (
            <div className="help_section__info-accounts--list">
              {uniqueAccounts.map((account, index) => (
                <div key={index} className="account_info">
                  <span className="account_number">Cuenta: {account.account_number}</span>
                  <div className="help_section__info-accounts--list-charges">
                    <span className="description">Descripción: {account.description || 'N/A'}</span>
                    <span className="charge">Motivos de cargo: {account.charge || 'N/A'}</span>
                    <span className="credit">Motivos de abono: {account.credit || 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HelpSection;
