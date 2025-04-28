import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ListSchoolCenter from './ListSchoolCenter';
import SchoolsServices from '../../../services/SchoolsServices';
import { vi } from 'vitest';

vi.mock('../../modal/ConfirmDeleteModal', () => {
  return {
    default: ({ isOpen, title, message, onDelete, onClose }) => {
      return isOpen ? (
        <div data-testid="confirm-delete-modal">
          <h2>{title}</h2>
          <p>{message}</p>
          <button onClick={onDelete}>Confirmar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      ) : null;
    },
  };
});

describe('ListSchoolCenter Component', () => {
  const sampleSchools = [
    {
      id: 1,
      school_name: 'Colegio Uno',
      phone: '123456789',
      province: 'Provincia A',
      address: 'Calle Falsa 123',
      website: 'www.colegiouno.com',
    },
    {
      id: 2,
      school_name: 'Colegio Dos',
      phone: '987654321',
      province: 'Provincia B',
      address: 'Avenida Siempre Viva 742',
      website: 'www.colegiodos.com',
    },
  ];

  let setSchoolsMock;
  let setSelectedSchoolMock;

  beforeEach(() => {
    setSchoolsMock = vi.fn();
    setSelectedSchoolMock = vi.fn();
  });

  it('renderiza la lista de centros correctamente', () => {
    render(
      <ListSchoolCenter
        schools={sampleSchools}
        setSchools={setSchoolsMock}
        setSelectedSchool={setSelectedSchoolMock}
      />
    );

    sampleSchools.forEach((school) => {
      expect(screen.getByText(school.school_name)).toBeInTheDocument();
      expect(screen.getByText(school.phone)).toBeInTheDocument();
      expect(screen.getByText(school.province)).toBeInTheDocument();
      expect(screen.getByText(school.address)).toBeInTheDocument();
      expect(screen.getByText(school.website)).toBeInTheDocument();
    });
  });

  it('llama a setSelectedSchool al hacer clic en el botón "Editar"', () => {
    render(
      <ListSchoolCenter
        schools={sampleSchools}
        setSchools={setSchoolsMock}
        setSelectedSchool={setSelectedSchoolMock}
      />
    );

    const editButtons = screen.getAllByText('Editar');
    fireEvent.click(editButtons[0]);
    expect(setSelectedSchoolMock).toHaveBeenCalledWith(sampleSchools[0]);
  });

  it('abre el modal al hacer clic en el botón "Eliminar" y muestra el mensaje correcto', () => {
    render(
      <ListSchoolCenter
        schools={sampleSchools}
        setSchools={setSchoolsMock}
        setSelectedSchool={setSelectedSchoolMock}
      />
    );

    const deleteButtons = screen.getAllByText('Eliminar');
    fireEvent.click(deleteButtons[0]);

    const modal = screen.getByTestId('confirm-delete-modal');
    expect(modal).toBeInTheDocument();
    expect(
      screen.getByText(`El centro"${sampleSchools[0].school_name}" será eliminado permanentemente.`)
    ).toBeInTheDocument();
  });

  it('llama a deleteSchool y actualiza la lista al confirmar la eliminación', async () => {
    vi.spyOn(SchoolsServices, 'remove').mockResolvedValueOnce({});

    render(
      <ListSchoolCenter
        schools={sampleSchools}
        setSchools={setSchoolsMock}
        setSelectedSchool={setSelectedSchoolMock}
      />
    );

    const deleteButtons = screen.getAllByText('Eliminar');
    fireEvent.click(deleteButtons[0]);

    const modal = screen.getByTestId('confirm-delete-modal');
    expect(modal).toBeInTheDocument();

    const confirmButton = screen.getByText('Confirmar');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(SchoolsServices.remove).toHaveBeenCalledWith(sampleSchools[0].id);
      expect(setSchoolsMock).toHaveBeenCalled();
    });
  });

  it('cierra el modal al hacer clic en "Cancelar"', () => {
    render(
      <ListSchoolCenter
        schools={sampleSchools}
        setSchools={setSchoolsMock}
        setSelectedSchool={setSelectedSchoolMock}
      />
    );

    const deleteButtons = screen.getAllByText('Eliminar');
    fireEvent.click(deleteButtons[0]);

    let modal = screen.getByTestId('confirm-delete-modal');
    expect(modal).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(screen.queryByTestId('confirm-delete-modal')).not.toBeInTheDocument();
  });
});
