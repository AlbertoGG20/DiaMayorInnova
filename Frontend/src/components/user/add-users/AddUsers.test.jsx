import React from 'react';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import flushPromises from 'flush-promises';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from "vitest";
import AddUsers from "./AddUsers";
import { faker } from '@faker-js/faker';

vi.mock("../../../context/AuthContext.jsx", () => ({
  useAuth: () => ({ signUpAction: vi.fn().mockResolvedValue({ data: { data: { user: {} } } }) })
}));

vi.mock("../../../services/userService.js", () => ({
  updateUser: vi.fn().mockResolvedValue({ data: { data: { user: {} } } })
}));

beforeAll(() => {
  global.URL.createObjectURL = vi.fn().mockReturnValue('blob://dummy-url');
});

afterAll(() => {
  global.URL.createObjectURL.mockRestore();
});

describe("AddUsers Component", () => {
  const mockSetUsers = vi.fn();
  const mockSetSelectedUser = vi.fn();

  it("Debe renderizar el formulario correctamente", () => {
    render(<AddUsers setUsers={mockSetUsers} setSelectedUser={mockSetSelectedUser} />);
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirmar Password")).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Registrar Usuario/i })).toBeInTheDocument();
  });

  it("Debe permitir la entrada de datos en los campos de texto", () => {
    render(<AddUsers setUsers={mockSetUsers} setSelectedUser={mockSetSelectedUser} />);
    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const fakeEmail = faker.internet.email();
    fireEvent.change(emailInput, { target: { value: fakeEmail } });
    expect(emailInput.value).toBe(fakeEmail);
  });

  it("Debe actualizar el estado al seleccionar un archivo", () => {
    render(<AddUsers setUsers={mockSetUsers} setSelectedUser={mockSetSelectedUser} />);
    const fileInput = screen.getByLabelText(/Introduzca una imagen de usuario/i);
    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(fileInput.files[0]).toBe(file);
  });

  it("Debe cambiar el rol cuando se selecciona otro", () => {
    render(<AddUsers setUsers={mockSetUsers} setSelectedUser={mockSetSelectedUser} />);
    const roleSelect = screen.getByLabelText(/Seleccione un rol/i);
    fireEvent.change(roleSelect, { target: { value: "teacher" } });
    expect(roleSelect.value).toBe("teacher");
  });

  it("Debe mostrar error si las contraseñas no coinciden", async () => {
    render(<AddUsers setUsers={() => {}} selectedUser={null} setSelectedUser={() => {}} />);

    const emailInput = screen.getByLabelText('Correo electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    const confirmPasswordInput = screen.getByLabelText('Confirmar contraseña');
    const nameInput = screen.getByLabelText('Nombre');
    const firstLastNameInput = screen.getByLabelText('Primer Apellido');
    const secondLastNameInput = screen.getByLabelText('Segundo Apellido');
    const submitButton = screen.getByRole('button', { name: /Registrar Usuario/i });

    await userEvent.type(emailInput, faker.internet.email());
    await userEvent.type(passwordInput, faker.internet.password());
    await userEvent.type(confirmPasswordInput, faker.internet.password());
    await userEvent.type(nameInput, faker.person.firstName());
    await userEvent.type(firstLastNameInput, faker.person.lastName());
    await userEvent.type(secondLastNameInput, faker.person.lastName());

    await userEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent('Las contraseñas no coinciden o están vacías.');
    });
  });
});
