import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { faker } from '@faker-js/faker';
import SchoolCenters from './SchoolCenters';
import * as SchoolServices from '../../services/SchoolsServices.js';

// Mock de SchoolServices
vi.mock('../../services/SchoolsServices.js', () => ({
  default: {
    getAll: vi.fn(),
  },
}));

// Mocks de los componentes hijos
vi.mock('./list-school-center/ListSchoolCenter.jsx', () => ({
  default: ({ schools }) => (
    <div data-testid="list-school-center">
      {schools.map((school) => (
        <div key={school.id}>{school.school_name}</div>
      ))}
    </div>
  ),
}));

// Mock de AddSchoolCenter Dummy
vi.mock('./add-school-center/AddSchoolCenter.jsx', () => ({
  default: () => <div data-testid="add-school-center">Add School Center Component</div>,
}));

// Mock de FindNameSchoolCenter
vi.mock('./find-name-school-center/FindNameSchoolCenter.jsx', () => ({
  default: ({ searchSchoolName, setSeachSchoolName }) => (
    <input
      data-testid="find-name-school-center"
      value={searchSchoolName}
      onChange={(e) => setSeachSchoolName(e.target.value)}
    />
  ),
}));

describe('SchoolCenters Component', () => {
  const fakeSchools = [
    { id: 1, school_name: 'Escuela Uno' },
    { id: 2, school_name: 'Instituto Dos' },
    { id: 3, school_name: 'Colegio Tres' },
  ];

  beforeEach(() => {
    SchoolServices.default.getAll.mockResolvedValue({ data: fakeSchools });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar al servicio y renderizar los componentes hijos', async () => {
    render(<SchoolCenters />);

    await waitFor(() => {
      expect(screen.getByTestId('list-school-center')).toBeInTheDocument();
    });

    expect(screen.getByText('Escuela Uno')).toBeInTheDocument();
    expect(screen.getByText('Instituto Dos')).toBeInTheDocument();
    expect(screen.getByText('Colegio Tres')).toBeInTheDocument();

    expect(screen.getByTestId('add-school-center')).toBeInTheDocument();
    expect(screen.getByTestId('find-name-school-center')).toBeInTheDocument();
  });

  it('debe filtrar los centros según el valor de búsqueda', async () => {
    render(<SchoolCenters />);

    await waitFor(() => {
      expect(screen.getByTestId('list-school-center')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('find-name-school-center');
    fireEvent.change(searchInput, { target: { value: 'uno' } });

    await waitFor(() => {
      expect(screen.getByText('Escuela Uno')).toBeInTheDocument();
    });
    expect(screen.queryByText('Instituto Dos')).not.toBeInTheDocument();
    expect(screen.queryByText('Colegio Tres')).not.toBeInTheDocument();
  });
});