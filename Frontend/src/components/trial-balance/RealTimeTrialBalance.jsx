import { useMemo } from 'react';
import { formatCurrency } from '../../utils/formatCurrency'
import './RealTimeTrialBalance.css';

const RealTimeTrialBalance = ({ entries }) => {
  // Agrupar todos los apuntes de todas las entradas
  const balanceData = useMemo(() => {
    const grouped = {};

    entries.forEach(entry => {
      const validAnnotations = entry.annotations?.filter(anno => !anno._destroy) || [];

      validAnnotations.forEach(anno => {
        const accountId = anno.account_number;
        if (!accountId) return; // Saltamos apuntes incompletos

        if (!grouped[accountId]) {
          grouped[accountId] = {
            account_number: anno.account_number,
            account_name: anno.account_name || anno.account?.name || '',
            debe: 0,
            haber: 0,
          };
        }

        const debit = parseFloat(anno.debit) || 0;
        const credit = parseFloat(anno.credit) || 0;

        grouped[accountId].debe += debit;
        grouped[accountId].haber += credit;
      });
    });

    // Convertimos a array con saldos
    return Object.values(grouped)
      .filter(acc => acc.debe !== 0 || acc.haber !== 0) // Solo incluimos cuentas con movimientos
      .map((acc, idx) => {
        const saldo = acc.debe - acc.haber;
        return {
          orden: idx + 1,
          account_number: acc.account_number,
          account_name: acc.account_name,
          debe: acc.debe,
          haber: acc.haber,
          deudor: saldo > 0 ? saldo : '',
          acreedor: saldo < 0 ? -saldo : '',
        };
      });
  }, [entries]);

  // Calcular totales
  const totals = useMemo(() => {
    return balanceData.reduce(
      (acc, row) => {
        acc.debe += row.debe;
        acc.haber += row.haber;
        acc.deudor += parseFloat(row.deudor) || 0;
        acc.acreedor += parseFloat(row.acreedor) || 0;
        return acc;
      },
      { debe: 0, haber: 0, deudor: 0, acreedor: 0 }
    );
  }, [balanceData]);

  return (
    <div className="trial-balance-container">
      <h3>Balance de Comprobación</h3>
      <table className="trial-balance-table">
        <thead>
          <tr>
            <th>Orden</th>
            <th>Nº de cuenta</th>
            <th>Nombre Cuenta</th>
            <th>Debe</th>
            <th>Haber</th>
            <th>Deudores</th>
            <th>Acreedores</th>
          </tr>
        </thead>
        <tbody>
          {balanceData.map((row) => (
            <tr key={row.account_number}>
              <td data-label="Orden">{row.orden}</td>
              <td data-label="Nº de cuenta">{row.account_number}</td>
              <td data-label="Nombre Cuenta">{row.account_name}</td>
              <td data-label="Debe" className='money-cell'>{formatCurrency(row.debe)}</td>
              <td data-label="Haber" className='money-cell'>{formatCurrency(row.haber)}</td>
              <td data-label="Deudores" className='money-cell'>{row.deudor !== '' ? formatCurrency(row.deudor) : ''}</td>
              <td data-label="Acreedores" className='money-cell'>{row.acreedor !== '' ? formatCurrency(row.acreedor) : ''}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan="3">Totales</th>
            <th data-testid="total-debe" className='money-cell'>{formatCurrency(totals.debe)}</th>
            <th data-testid="total-haber" className='money-cell'>{formatCurrency(totals.haber)}</th>
            <th data-testid="total-deudores" className='money-cell'>{formatCurrency(totals.deudor)}</th>
            <th data-testid="total-acreedores" className='money-cell'>{formatCurrency(totals.acreedor)}</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default RealTimeTrialBalance;
