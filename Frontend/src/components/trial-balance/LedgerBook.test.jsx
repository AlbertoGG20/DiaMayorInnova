import React from 'react';
import { render, screen } from '@testing-library/react';
import LedgerBook from './LedgerBook';

describe('LedgerBook Component', () => {
  const mockEntries = [
    {
      entry_number: 1,
      annotations: [
        {
          account_number: '476',
          debit: '2250.00',
          credit: '0.00'
        },
        {
          account_number: '572',
          debit: '0.00',
          credit: '2200.00'
        }
      ]
    },
    {
      entry_number: 2,
      annotations: [
        {
          account_number: '4777',
          debit: '1820.00',
          credit: '0.00'
        }
      ]
    }
  ];

  it('renders the component with correct title', () => {
    render(<LedgerBook entries={mockEntries} />);
    expect(screen.getByText('Libro Mayor')).toBeInTheDocument();
  });

  it('renders the component with custom title', () => {
    render(<LedgerBook entries={mockEntries} title="Libro Mayor Personalizado" />);
    expect(screen.getByText('Libro Mayor Personalizado')).toBeInTheDocument();
  });

  it('displays account numbers and totals correctly', () => {
    render(<LedgerBook entries={mockEntries} />);
    
    // Verificar que los números de cuenta aparecen
    expect(screen.getByText('476')).toBeInTheDocument();
    expect(screen.getByText('572')).toBeInTheDocument();
    expect(screen.getByText('4777')).toBeInTheDocument();
    
    // Verificar que los totales se muestran correctamente
    const accountRows = screen.getAllByRole('row');
    const accountTotals = accountRows.filter(row => row.className.includes('ledger-book-account-totals'));
    
    expect(accountTotals[0]).toHaveTextContent('2250,00');
    expect(accountTotals[1]).toHaveTextContent('2200,00');
    expect(accountTotals[2]).toHaveTextContent('1820,00');
  });

  it('displays entry numbers correctly', () => {
    render(<LedgerBook entries={mockEntries} />);
    const entryNumbers = screen.getAllByText('1');
    expect(entryNumbers.length).toBe(2); // Debería haber dos asientos con número 1
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('calculates and displays correct balances', () => {
    render(<LedgerBook entries={mockEntries} />);
    
    // Verificar saldos
    const accountRows = screen.getAllByRole('row');
    const accountTotals = accountRows.filter(row => row.className.includes('ledger-book-account-totals'));
    
    expect(accountTotals[0]).toHaveTextContent('2250,00');
    expect(accountTotals[1]).toHaveTextContent('-2200,00');
    expect(accountTotals[2]).toHaveTextContent('1820,00');
  });

  it('displays negative balances with correct styling', () => {
    render(<LedgerBook entries={mockEntries} />);
    const negativeCells = screen.getAllByText(/-2200,00\s*€/);
    negativeCells.forEach(cell => {
      expect(cell).toHaveClass('ledger-book-negative');
    });
  });

  it('displays general totals correctly', () => {
    render(<LedgerBook entries={mockEntries} />);
    const footerRow = screen.getByRole('row', { name: /total general/i });
    expect(footerRow).toHaveTextContent('4070,00');
    expect(footerRow).toHaveTextContent('2200,00');
    expect(footerRow).toHaveTextContent('1870,00');
  });
}); 