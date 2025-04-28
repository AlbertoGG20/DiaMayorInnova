import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FindNameSchoolCenter from './FindNameSchoolCenter';

describe('FindNameSchoolCenter Component', () => {
  const mockSetSearch = vi.fn();
  
  const initialProps = {
    searchSchoolName: '',
    setSeachSchoolName: mockSetSearch
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar correctamente todos los elementos', () => {
    render(<FindNameSchoolCenter {...initialProps} />);
    
    expect(screen.getByRole('heading', { name: /buscar por nombre/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /filtrar por nombre de centro/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/nombre del centro/i)).toBeInTheDocument();
    expect(screen.getByTestId('fi-fi-rr-search')).toBeInTheDocument();
  });

  it('debe mostrar el valor inicial en el input', () => {
    const props = {
      ...initialProps,
      searchSchoolName: 'Colegio Ejemplo'
    };
    
    render(<FindNameSchoolCenter {...props} />);
    
    expect(screen.getByRole('textbox')).toHaveValue('Colegio Ejemplo');
  });

  it('debe llamar a setSeachSchoolName al cambiar el input', () => {
    render(<FindNameSchoolCenter {...initialProps} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'Nuevo Valor' } });
    
    expect(mockSetSearch).toHaveBeenCalledTimes(1);
    expect(mockSetSearch).toHaveBeenCalledWith('Nuevo Valor');
  });

  it('debe tener los atributos de accesibilidad correctos', () => {
    render(<FindNameSchoolCenter {...initialProps} />);
    const input = screen.getByRole('textbox');
    
    expect(input).toHaveAttribute('id', 'searchSchoolName');
    expect(input).toHaveAttribute('aria-label', 'Filtrar por nombre de centro');
  });

  it('debe manejar valores vacíos correctamente', () => {
    const props = {
      searchSchoolName: 'Valor inicial',
      setSeachSchoolName: mockSetSearch
    };
    
    render(<FindNameSchoolCenter {...props} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: '' } });
    
    expect(mockSetSearch).toHaveBeenCalledWith('');
  });
});