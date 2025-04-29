import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RealTimeTrialBalance from './RealTimeTrialBalance';

describe('RealTimeTrialBalance Component', () => {
  const mockEntries = [
    {
      annotations: [
        {
          account_id: 1,
          account_number: '100',
          account_name: 'Caja',
          debit: 1000,
          credit: 0,
          _destroy: false
        },
        {
          account_id: 2,
          account_number: '400',
          account_name: 'Ventas',
          debit: 0,
          credit: 1000,
          _destroy: false
        }
      ]
    },
    {
      annotations: [
        {
          account_id: 1,
          account_number: '100',
          account_name: 'Caja',
          debit: 500,
          credit: 0,
          _destroy: false
        },
        {
          account_id: 3,
          account_number: '600',
          account_name: 'Compras',
          debit: 0,
          credit: 500,
          _destroy: false
        }
      ]
    }
  ];

  it('debe renderizar el título correctamente', () => {
    render(<RealTimeTrialBalance entries={[]} />);
    expect(screen.getByText('Balance de Comprobación')).toBeInTheDocument();
  });

  it('debe mostrar los encabezados de la tabla correctamente', () => {
    render(<RealTimeTrialBalance entries={[]} />);
    expect(screen.getByText('Orden')).toBeInTheDocument();
    expect(screen.getByText('Nº de cuenta')).toBeInTheDocument();
    expect(screen.getByText('Nombre Cuenta')).toBeInTheDocument();
    expect(screen.getByText('Debe')).toBeInTheDocument();
    expect(screen.getByText('Haber')).toBeInTheDocument();
    expect(screen.getByText('Deudores')).toBeInTheDocument();
    expect(screen.getByText('Acreedores')).toBeInTheDocument();
  });

  it('debe calcular y mostrar los totales correctamente', () => {
    render(<RealTimeTrialBalance entries={mockEntries} />);
    
    // Verificar totales usando data-label para ser más específicos
    expect(screen.getByTestId('total-debe')).toHaveTextContent('1500.00');
    expect(screen.getByTestId('total-haber')).toHaveTextContent('1500.00');
    expect(screen.getByTestId('total-deudores')).toHaveTextContent('1500.00');
    expect(screen.getByTestId('total-acreedores')).toHaveTextContent('1500.00');
  });

  it('debe mostrar las cuentas con sus saldos correctamente', () => {
    render(<RealTimeTrialBalance entries={mockEntries} />);
    
    // Verificar primera cuenta (Caja)
    const cajaRow = screen.getByText('Caja').closest('tr');
    expect(cajaRow).toHaveTextContent('100');
    expect(cajaRow).toHaveTextContent('1500.00'); // Debe
    expect(cajaRow).toHaveTextContent('0.00'); // Haber
    expect(cajaRow).toHaveTextContent('1500.00'); // Deudor
    
    // Verificar segunda cuenta (Ventas)
    const ventasRow = screen.getByText('Ventas').closest('tr');
    expect(ventasRow).toHaveTextContent('400');
    expect(ventasRow).toHaveTextContent('0.00'); // Debe
    expect(ventasRow).toHaveTextContent('1000.00'); // Haber
    expect(ventasRow).toHaveTextContent('1000.00'); // Acreedor
    
    // Verificar tercera cuenta (Compras)
    const comprasRow = screen.getByText('Compras').closest('tr');
    expect(comprasRow).toHaveTextContent('600');
    expect(comprasRow).toHaveTextContent('0.00'); // Debe
    expect(comprasRow).toHaveTextContent('500.00'); // Haber
    expect(comprasRow).toHaveTextContent('500.00'); // Acreedor
  });

  it('debe manejar correctamente las entradas vacías', () => {
    render(<RealTimeTrialBalance entries={[]} />);
    
    // Verificar que no hay filas de datos
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(2); // Solo encabezado y pie de tabla
    
    // Verificar que los totales son 0 usando data-label
    expect(screen.getByTestId('total-debe')).toHaveTextContent('0.00');
    expect(screen.getByTestId('total-haber')).toHaveTextContent('0.00');
    expect(screen.getByTestId('total-deudores')).toHaveTextContent('0.00');
    expect(screen.getByTestId('total-acreedores')).toHaveTextContent('0.00');
  });

  it('debe ignorar las anotaciones marcadas para destrucción', () => {
    const entriesWithDestroyed = [
      {
        annotations: [
          {
            account_id: 1,
            account_number: '100',
            account_name: 'Caja',
            debit: 1000,
            credit: 0,
            _destroy: true // Esta anotación debe ser ignorada
          },
          {
            account_id: 2,
            account_number: '400',
            account_name: 'Ventas',
            debit: 0,
            credit: 1000,
            _destroy: false
          }
        ]
      }
    ];

    render(<RealTimeTrialBalance entries={entriesWithDestroyed} />);
    
    // Verificar que la cuenta Caja no aparece
    expect(screen.queryByText('100')).not.toBeInTheDocument();
    expect(screen.queryByText('Caja')).not.toBeInTheDocument();
    
    // Verificar que la cuenta Ventas sí aparece
    expect(screen.getByText('400')).toBeInTheDocument();
    expect(screen.getByText('Ventas')).toBeInTheDocument();
  });
}); 