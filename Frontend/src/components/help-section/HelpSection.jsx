import { useState, useEffect, useMemo } from 'react';
import solutionService from '../../services/solutionService';
import { formatCurrency } from '../../utils/formatCurrency';
import Spinner from '../spinners/Spinner';
import "./HelpSection.css";

const HelpSection = ({ statementId }) => {
  const [solution, setSolution] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Expandable sections
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isEntriesExpanded, setIsEntriesExpanded] = useState(false);
  const [isAccountsExpanded, setIsAccountsExpanded] = useState(false);

  const toggleDescription = () => setIsDescriptionExpanded(prev => !prev);
  const toggleEntries = () => setIsEntriesExpanded(prev => !prev);
  const toggleAccounts = () => setIsAccountsExpanded(prev => !prev);

  const fetchExampleSolution = async () => {
    if (!statementId) {
      setIsLoading(false);
      setErrorMessage('No se proporcionó un ID de enunciado');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');

    try {
      const response = await solutionService.getExampleSolution(statementId);

      // Improved check - response IS the solution directly
      if (!response || !response.entries || !Array.isArray(response.entries)) {
        setIsLoading(false);
        setSolution(null);
        return;
      }

      const normalizedSolution = {
        ...response,
        entries: response.entries.map(entry => ({
          ...entry,
          annotations: entry.annotations?.map(ann => ({
            ...ann,
            debit: ann.debit ? parseFloat(ann.debit) : 0,
            credit: ann.credit ? parseFloat(ann.credit) : 0,
            account: {
              ...(ann.account || {}),
              account_number: ann.account?.account_number || ann.account_id,
              name: ann.account?.name || ann.account_name
            }
          })) || []
        }))
      };

      setSolution(normalizedSolution);
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.error || 'Error al obtener la solución';

      setIsError(status !== 404);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExampleSolution()
  }, [statementId]);

  // Extract unique accounts from solution entries
  const getUniqueAccounts = () => {
    if (!solution?.entries) return [];

    const accounts = new Map();
    solution.entries.forEach(entry => {
      entry.annotations?.forEach(annotation => {
        const accountData = annotation.account || {};
        if (accountData.account_number || annotation.account_id) {
          accounts.set(accountData.account_number || annotation.account_id, {
            account_number: accountData.account_number || annotation.account_id,
            description: accountData.description || '',
            name: accountData.name || annotation.account_name || '',
            charge: accountData.charge || null,
            credit: accountData.credit || null
          });
        }
      });
    });

    return Array.from(accounts.values());
  };

  const uniqueAccounts = useMemo(() => getUniqueAccounts(), [solution]);

  if (isLoading) {
    return (
      <section className="section-one_loader">
        <Spinner />
        <p>Buscando solución de ejemplo...</p>
      </section>
    );
  }

  const handleRetry = () => fetchExampleSolution();
  if (isError) {
    return (
      <section className='help_section__container'>
        <p className='text-error-feedback'>{errorMessage}</p>
        <button
          onClick={handleRetry}
          className="retry-button"
        >
          Reintentar
        </button>
      </section>
    );
  }

  if (!solution || !solution.entries || solution.entries.length === 0) {
    return (
      <section className='help_section__container'>
        <p>No hay solución de ejemplo disponible</p>
        <p className="help-text">Puedes crear una solución como ejemplo desde el panel de administración.</p>
      </section>
    );
  }

  return (
    <section className='help_section__container'>
      <h2 className='help_section_title'>Ejemplo de solución</h2>

      <div className="help_section__solution_info scroll-style">
        <div className="help_section__solution--description">
          <div className="help_section__header" onClick={toggleDescription}>
            <h4 className='help_section__lead'>Descripción</h4>
            <button className="help_section__expand_button">
              <i className={`fi fi-rr-angle-${isDescriptionExpanded ? 'up' : 'down'}`}></i>
            </button>
          </div>
          {isDescriptionExpanded && (
            <div className="help_section__solution--description-content">
              <p>{solution.description || 'No hay descripción disponible'}</p>
            </div>
          )}
        </div>

        <div className="help_section__solution--entries">
          <div className="help_section__header" onClick={toggleEntries}>
            <h4 className='help_section__lead'>Asientos</h4>
            <button className="help_section__expand_button">
              <i className={`fi fi-rr-angle-${isEntriesExpanded ? 'up' : 'down'}`}></i>
            </button>
          </div>

          {isEntriesExpanded && solution.entries?.length > 0 ? (
            <div className="help_section__solution--entries-list-wrapper">
              <div className="help_section__solution--entries-list">
                {solution.entries.map((entry, index) => (
                  <EntryDetail key={index} entry={entry} />
                ))}
              </div>
            </div>
          ) : isEntriesExpanded && (
            <p className="no-entries-message">No hay asientos registrados</p>
          )}
        </div>

        <div className="help_section__info-accounts">
          <div className="help_section__header" onClick={toggleAccounts}>
            <h4 className='help_section__lead'>Información de Cuentas</h4>
            <button className="help_section__expand_button">
              <i className={`fi fi-rr-angle-${isAccountsExpanded ? 'up' : 'down'}`}></i>
            </button>
          </div>

          {isAccountsExpanded && uniqueAccounts.length > 0 ? (
            <div className="help_section__info-accounts--list">
              {uniqueAccounts.map((account, index) => (
                <AccountDetail key={index} account={account} />
              ))}
            </div>
          ) : isAccountsExpanded && (
            <p className="no-accounts-message">No hay información de cuentas</p>
          )}
        </div>
      </div>
    </section>
  );
};

const AccountDetail = ({ account }) => (
  <div className="account_info">
    <span className="account_number">Cuenta: {account.account_number}</span>
    <div className="help_section__info-accounts--list-charges">
      <span className="description">Descripción: {account.description || 'N/A'}</span>
      <span className="charge">Motivos de cargo: {account.charge || 'N/A'}</span>
      <span className="credit">Motivos de abono: {account.credit || 'N/A'}</span>
    </div>
  </div>
);

const EntryDetail = ({ entry }) => (
  <div className="help_section__entry_info">
    <div className="help_section__header">
      <div className="help_section__head_tittle">
        <h4 className='help_section__lead'>Asiento {entry.entry_number}</h4>
        <p className="help_section__entry_date">Fecha: {entry.entry_date}</p>
      </div>
    </div>
    <div className="help_section__solution--entry-body">
      <EntryHeader />
      <EntryAnnotations annotations={entry.annotations} />
    </div>
  </div>
);

const EntryHeader = () => (
  <section className="help_section__solution--entry-body-title">
    <header className="help_section__header_container">
      <p className='help_section__apt_number'>Apt</p>
      <div className="help_section__tittles_wrapper">
        <p className='help_section__tittle_account-number'>Nº Cuenta</p>
        <p className='help_section__tittle_account-name help_section__tittle_account-name--no-visible'>Nombre Cuenta</p>
        <p className='help_section__tittle_debit'>Debe</p>
        <p className='help_section__tittle_credit'>Haber</p>
      </div>
    </header>
  </section>
);

const EntryAnnotations = ({ annotations }) => (
  <div className="help_section__entry_item_container scroll-style">
    {annotations?.map((annotation, annIndex) => {
      return (
        <div key={annIndex} className="help_section__entry_form_wrapper">
          <p className='help_section__apt_number'>{annIndex + 1}</p>
          <div className="help_section__entry_form">
            <div className="help_section__entry_form_inputs__wrapper">
              <AccountNumber number={annotation.account.account_number} />
              <AccountName name={annotation.account.name} />
              <DebitValue value={annotation.debit} />
              <CreditValue value={annotation.credit} />
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

const AccountNumber = ({ number }) => (
  <div className="help_section__form_group help_section__account_number_group">
    <span className="help_section__account_number">{number || '-'}</span>
  </div>
);

const AccountName = ({ name }) => (
  <div className="help_section__form_group help_section__account_name_group">
    <span className="help_section__account_name">{name || ''}</span>
  </div>
);

const DebitValue = ({ value }) => (
  <div className="help_section__form_group help_section__debit_group">
    {value && parseFloat(value) !== 0 ? (
      <span className="help_section__debit_value">
        {formatCurrency(value)}
      </span>
    ) : null}
  </div>
);

const CreditValue = ({ value }) => (
  <div className="help_section__form_group help_section__credit_group">
    {value && parseFloat(value) !== 0 ? (
      <span className="help_section__credit_value">
        {formatCurrency(value)}
      </span>
    ) : null}
  </div>
);

export default HelpSection;