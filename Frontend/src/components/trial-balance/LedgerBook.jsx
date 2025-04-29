import React, { useMemo, useState } from 'react';
import './LedgerBook.css';

const LedgerBook = ({ entries, title = "Libro Mayor" }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'accountNumber',
    direction: 'asc'
  });

  const processedData = useMemo(() => {
    const accountsMap = new Map();
    
    entries.forEach(entry => {
      const validAnnotations = entry.annotations?.filter(anno => !anno._destroy) || [];
      validAnnotations.forEach((annotation, index) => {
        const accountNumber = String(annotation.account_number).trim();
        if (!accountNumber) return; // Saltar si no hay número de cuenta

        if (!accountsMap.has(accountNumber)) {
          accountsMap.set(accountNumber, {
            accountNumber,
            entries: []
          });
        }
        // Añadir un índice único para cada anotación dentro del mismo asiento
        accountsMap.get(accountNumber).entries.push({
          entryNumber: entry.entry_number,
          entryIndex: index, // Índice único para cada anotación en el mismo asiento
          debit: parseFloat(annotation.debit) || 0,
          credit: parseFloat(annotation.credit) || 0
        });
      });
    });

    // Calcular saldos y ordenar
    let accounts = Array.from(accountsMap.values()).map(account => {
      let totalDebit = 0;
      let totalCredit = 0;
      
      account.entries.forEach(entry => {
        totalDebit += entry.debit;
        totalCredit += entry.credit;
      });

      const balance = totalDebit - totalCredit;
      
      return {
        ...account,
        totalDebit,
        totalCredit,
        balance
      };
    });

    // Ordenar las cuentas
    if (sortConfig.key === 'accountNumber') {
      accounts.sort((a, b) => {
        const aValue = parseInt(a.accountNumber);
        const bValue = parseInt(b.accountNumber);
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    // Ordenar los asientos dentro de cada cuenta
    accounts = accounts.map(account => ({
      ...account,
      entries: [...account.entries].sort((a, b) => {
        if (sortConfig.key === 'entryNumber') {
          return sortConfig.direction === 'asc' ? a.entryNumber - b.entryNumber : b.entryNumber - a.entryNumber;
        }
        return 0;
      })
    }));
    
    // Calcular totales generales
    const totalDebit = accounts.reduce((sum, acc) => sum + acc.totalDebit, 0);
    const totalCredit = accounts.reduce((sum, acc) => sum + acc.totalCredit, 0);

    return {
      accounts,
      totalDebit,
      totalCredit
    };
  }, [entries, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <i className="fi fi-rr-angle-small-down sort-icon-inactive" />;
    return sortConfig.direction === 'asc' 
      ? <i className="fi fi-rr-angle-small-up" /> 
      : <i className="fi fi-rr-angle-small-down" />;
  };

  return (
    <div className="ledger-book">
      <h3>{title}</h3>
      <table className="ledger-book-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('accountNumber')} className="sortable-header">
              Cuenta <span className="sort-icon">{getSortIcon('accountNumber')}</span>
            </th>
            <th onClick={() => handleSort('entryNumber')} className="sortable-header">
              Asiento <span className="sort-icon">{getSortIcon('entryNumber')}</span>
            </th>
            <th>Debe</th>
            <th>Haber</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {processedData.accounts.map((account, index) => (
            <React.Fragment key={`${account.accountNumber}-${index}`}>
              <tr className="ledger-book-account-totals">
                <td>{account.accountNumber}</td>
                <td></td>
                <td>{formatCurrency(account.totalDebit)}</td>
                <td>{formatCurrency(account.totalCredit)}</td>
                <td className={account.balance < 0 ? 'ledger-book-negative' : ''}>
                  {formatCurrency(account.balance)}
                </td>
              </tr>
              {account.entries.map((entry) => (
                <tr 
                  key={`${account.accountNumber}-${entry.entryNumber}-${entry.entryIndex}`} 
                  className="ledger-book-entry-row"
                >
                  <td></td>
                  <td>{entry.entryNumber}</td>
                  <td>{formatCurrency(entry.debit)}</td>
                  <td>{formatCurrency(entry.credit)}</td>
                  <td className={entry.debit - entry.credit < 0 ? 'ledger-book-negative' : ''}>
                    {formatCurrency(entry.debit - entry.credit)}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan="2">Total General</th>
            <th>{formatCurrency(processedData.totalDebit)}</th>
            <th>{formatCurrency(processedData.totalCredit)}</th>
            <th className={processedData.totalDebit - processedData.totalCredit < 0 ? 'ledger-book-negative' : ''}>
              {formatCurrency(processedData.totalDebit - processedData.totalCredit)}
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default LedgerBook;