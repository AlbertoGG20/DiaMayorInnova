import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { faker } from '@faker-js/faker';
import AddSchoolCenter from './AddSchoolCenter';
import SchoolsServices from '../../../services/SchoolsServices';

// Mock del módulo SchoolsServices (export default)
vi.mock('../../../services/SchoolsServices', () => ({
  default: {
    create: vi.fn(),
    update: vi.fn(),
  },
}));

// Funciones mock para las props del componente
const mockSetSchools = vi.fn();
const mockSetSelectedSchool = vi.fn();

describe('AddSchoolCenter Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el formulario correctamente', () => {
    render(
      <AddSchoolCenter 
        setSchools={mockSetSchools} 
        selectedSchool={null} 
        setSelectedSchool={mockSetSelectedSchool} 
      />
    );

    // Se comprueban los inputs y botones según los labels y placeholders
    expect(screen.getByLabelText(/Nombre del centro/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Provincia/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dirección del centro/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo del centro/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Web del centro/i)).toBeInTheDocument();
    // Al no haber un selectedSchool, el botón debe indicar "Añadir Centro"
    expect(screen.getByRole('button', { name: /Añadir Centro/i })).toBeInTheDocument();
  });

  it('debe actualizar el estado al cambiar los inputs', () => {
    render(
      <AddSchoolCenter 
        setSchools={mockSetSchools} 
        selectedSchool={null} 
        setSelectedSchool={mockSetSelectedSchool} 
      />
    );

    const schoolNameInput = screen.getByLabelText(/Nombre del centro/i);
    const provinceInput = screen.getByLabelText(/Provincia/i);
    const addressInput = screen.getByLabelText(/Dirección del centro/i);
    const phoneInput = screen.getByLabelText(/Telefono/i);
    const emailInput = screen.getByLabelText(/Correo del centro/i);
    const websiteInput = screen.getByLabelText(/Web del centro/i);

    const fakeSchoolName = faker.company.name();
    const fakeProvince = faker.address.state();
    const fakeAddress = faker.address.streetAddress();
    const fakePhone = faker.phone.number();
    const fakeEmail = faker.internet.email();
    const fakeWebsite = faker.internet.url();

    fireEvent.change(schoolNameInput, { target: { value: fakeSchoolName } });
    fireEvent.change(provinceInput, { target: { value: fakeProvince } });
    fireEvent.change(addressInput, { target: { value: fakeAddress } });
    fireEvent.change(phoneInput, { target: { value: fakePhone } });
    fireEvent.change(emailInput, { target: { value: fakeEmail } });
    fireEvent.change(websiteInput, { target: { value: fakeWebsite } });

    expect(schoolNameInput.value).toBe(fakeSchoolName);
    expect(provinceInput.value).toBe(fakeProvince);
    expect(addressInput.value).toBe(fakeAddress);
    expect(phoneInput.value).toBe(fakePhone);
    expect(emailInput.value).toBe(fakeEmail);
    expect(websiteInput.value).toBe(fakeWebsite);
  });

  it('debe mostrar error si se dejan campos obligatorios vacíos', async () => {
    render(
      <AddSchoolCenter 
        setSchools={mockSetSchools} 
        selectedSchool={null} 
        setSelectedSchool={mockSetSelectedSchool} 
      />
    );

    // Solo se completan algunos campos; se dejan vacíos los obligatorios restantes
    fireEvent.change(screen.getByLabelText(/Nombre del centro/i), { target: { value: 'Centro 1' } });
    fireEvent.change(screen.getByLabelText(/Provincia/i), { target: { value: 'Provincia 1' } });
    // Se dejan vacíos Dirección, Telefono, Correo y Web

    fireEvent.click(screen.getByRole('button', { name: /Añadir Centro/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Por favor, complete todos los campos obligatorios');
    });
  });

  it('debe llamar a SchoolsServices.create y mostrar mensaje de éxito al crear un centro escolar', async () => {
    const newSchool = {
      id: faker.number.int(),
      school_name: 'Nuevo Centro',
      address: 'Calle Falsa 123',
      phone: '123456789',
      email: 'nuevo@centro.com',
      website: 'http://nuevo-centro.com',
      province: 'Provincia X'
    };

    SchoolsServices.create.mockResolvedValue({ data: newSchool });

    render(
      <AddSchoolCenter 
        setSchools={mockSetSchools} 
        selectedSchool={null} 
        setSelectedSchool={mockSetSelectedSchool} 
      />
    );

    // Completar todos los inputs requeridos
    fireEvent.change(screen.getByLabelText(/Nombre del centro/i), { target: { value: newSchool.school_name } });
    fireEvent.change(screen.getByLabelText(/Provincia/i), { target: { value: newSchool.province } });
    fireEvent.change(screen.getByLabelText(/Dirección del centro/i), { target: { value: newSchool.address } });
    fireEvent.change(screen.getByLabelText(/Telefono/i), { target: { value: newSchool.phone } });
    fireEvent.change(screen.getByLabelText(/Correo del centro/i), { target: { value: newSchool.email } });
    fireEvent.change(screen.getByLabelText(/Web del centro/i), { target: { value: newSchool.website } });

    fireEvent.click(screen.getByRole('button', { name: /Añadir Centro/i }));

    await waitFor(() => {
      // Se verifica que se haya llamado a create con los datos correctos
      expect(SchoolsServices.create).toHaveBeenCalledWith({
        school_name: newSchool.school_name,
        province: newSchool.province,
        address: newSchool.address,
        phone: newSchool.phone,
        email: newSchool.email,
        website: newSchool.website,
      });
      // Se comprueba que se actualice el estado mediante setSchools y se reinicie el selectedSchool
      expect(mockSetSchools).toHaveBeenCalled();
      expect(mockSetSelectedSchool).toHaveBeenCalledWith(null);
      // Se muestra el mensaje de éxito
      expect(screen.getByRole('alert')).toHaveTextContent('Centro escolar creado con éxito');
    });
  });

  it('debe llamar a SchoolsServices.update y mostrar mensaje de éxito al editar un centro escolar', async () => {
    const existingSchool = {
      id: faker.number.int(),
      school_name: 'Centro Existente',
      address: 'Calle Antigua 456',
      phone: '987654321',
      email: 'existe@centro.com',
      website: 'http://centroexistente.com',
      province: 'Provincia Y'
    };

    const updatedSchool = {
      ...existingSchool,
      school_name: 'Centro Actualizado'
    };

    SchoolsServices.update.mockResolvedValue({ data: updatedSchool });

    render(
      <AddSchoolCenter 
        setSchools={mockSetSchools} 
        selectedSchool={existingSchool} 
        setSelectedSchool={mockSetSelectedSchool} 
      />
    );

    // Se espera que los inputs estén precargados con los datos de existingSchool
    const schoolNameInput = screen.getByLabelText(/Nombre del centro/i);
    expect(schoolNameInput.value).toBe(existingSchool.school_name);

    // Modificamos el nombre
    fireEvent.change(schoolNameInput, { target: { value: updatedSchool.school_name } });
    fireEvent.click(screen.getByRole('button', { name: /Actualizar Centro/i }));

    await waitFor(() => {
      expect(SchoolsServices.update).toHaveBeenCalledWith(existingSchool.id, {
        school_name: updatedSchool.school_name,
        address: existingSchool.address,
        phone: existingSchool.phone,
        email: existingSchool.email,
        website: existingSchool.website,
        province: existingSchool.province,
      });
      expect(mockSetSchools).toHaveBeenCalled();
      expect(mockSetSelectedSchool).toHaveBeenCalledWith(null);
      expect(screen.getByRole('alert')).toHaveTextContent('Centro escolar actualizado con éxito');
    });
  });
});
