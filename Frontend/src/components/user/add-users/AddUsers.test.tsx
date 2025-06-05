import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { faker } from '@faker-js/faker';
import AddUsers from './AddUsers';
import { validationMessages } from './validationMessages';

vi.mock('../../../services/userService', async () => {
  const actual = await vi.importActual('../../../services/userService');

  return {
    ...actual,
    default: {
      createUser: vi.fn().mockResolvedValue({ data: { data: { user: {} } } }),
      updateUser: vi.fn().mockResolvedValue({ data: { data: { user: {} } } }),
    },
  };
});

const getTextInputsByLabelText = () => ({
  email: screen.getByLabelText('Correo electrónico') as HTMLInputElement,
  password: screen.getByLabelText('Contraseña') as HTMLInputElement,
  confirmPassword: screen.getByLabelText('Confirmar contraseña') as HTMLInputElement,
  name: screen.getByLabelText('Nombre') as HTMLInputElement,
  firstLastName: screen.getByLabelText('Primer Apellido') as HTMLInputElement,
  secondLastName: screen.getByLabelText('Segundo Apellido') as HTMLInputElement,
});

const getFileInputsByTextLabel = () => ({
  imageInput: screen.getByLabelText('Introduzca una imagen de usuario') as HTMLInputElement,
});


const getSelectInputsByTextLabel = () => ({
  roleSelect: screen.getByLabelText('Seleccione un rol') as HTMLInputElement,
});


const getAllInputsByLabelText = () => {
  return {
    ...getTextInputsByLabelText(),
    ...getFileInputsByTextLabel(),
    ...getSelectInputsByTextLabel(),
  };
};

describe('AddUsers Component', () => {
  const originalCreateObjectURL = URL.createObjectURL;

  beforeAll(() => {
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  });

  afterAll(() => {
    global.URL.createObjectURL = originalCreateObjectURL;
  });

  it('should render AddUsers component', () => {
    render(<AddUsers selectedUser={undefined} setSelectedUser={vi.fn()} onUserAdded={vi.fn()} />);

    Object.values(getAllInputsByLabelText()).forEach(element => {
      expect(element).toBeVisible();
    });
    expect(screen.getByRole('button', { name: 'Registrar Usuario' })).toBeVisible();
  });

  it('should allow the user to enter data in text fields', async () => {
    render(<AddUsers selectedUser={undefined} setSelectedUser={vi.fn()} onUserAdded={vi.fn()} />);
    const { email, password, confirmPassword, name, firstLastName, secondLastName } = getTextInputsByLabelText();

    const inputPairs: Array<[HTMLInputElement, string]> = [
      [email, faker.internet.email()],
      [password, faker.internet.password()],
      [confirmPassword, faker.internet.password()],
      [name, faker.person.firstName()],
      [firstLastName, faker.person.lastName()],
      [secondLastName, faker.person.lastName()],
    ];

    for (const [input, value] of inputPairs) {
      await userEvent.type(input, value);
      expect(input.value).toBe(value);
    }

    // there is no validation after entering data,
    // so there should be no error messages
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should update the state when a file is selected', () => {
    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });

    render(<AddUsers selectedUser={undefined} setSelectedUser={vi.fn()} onUserAdded={vi.fn()} />);
    const { imageInput } = getFileInputsByTextLabel();

    fireEvent.change(imageInput, { target: { files: [mockFile] } });
    expect(imageInput.files?.[0]).toBe(mockFile);

    const preview = screen.getByAltText(/imagen actual del usuario/i);
    expect(preview).toBeVisible();
    expect(preview).toHaveAttribute('src', expect.stringContaining('blob:'));
  });

  it('should change the role when a different option is selected', () => {
    render(<AddUsers selectedUser={undefined} setSelectedUser={vi.fn()} onUserAdded={vi.fn()} />);
    const { roleSelect } = getSelectInputsByTextLabel();

    fireEvent.change(roleSelect, { target: { value: 'teacher' } });
    expect(roleSelect.value).toBe('teacher');
  });

  it('should raise error if the email is not provided', async () => {
    render(<AddUsers selectedUser={undefined} setSelectedUser={vi.fn()} onUserAdded={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: 'Registrar Usuario' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(validationMessages.emailRequired);
    });
  });

  it('should raise error if email format is invalid', async () => {
    render(<AddUsers selectedUser={undefined} setSelectedUser={vi.fn()} onUserAdded={vi.fn()} />);
    const { email } = getTextInputsByLabelText();

    await userEvent.type(email, 'correo@no-valido');
    await userEvent.click(screen.getByRole('button', { name: 'Registrar Usuario' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(validationMessages.emailInvalid);
    });
  });

  it('should raise error if name is empty', async () => {
    render(<AddUsers selectedUser={undefined} setSelectedUser={vi.fn()} onUserAdded={vi.fn()} />);
    const { email } = getTextInputsByLabelText();

    await userEvent.type(email, faker.internet.email());
    await userEvent.click(screen.getByRole('button', { name: 'Registrar Usuario' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(validationMessages.nameRequired);
    });
  });

  it('should raise error if first last name is empty', async () => {
  render(<AddUsers selectedUser={undefined} setSelectedUser={vi.fn()} onUserAdded={vi.fn()} />);
  const { email, name } = getTextInputsByLabelText();

    await userEvent.type(email, faker.internet.email());
    await userEvent.type(name, faker.person.firstName());
    await userEvent.click(screen.getByRole('button', { name: 'Registrar Usuario' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(validationMessages.firstLastNameRequired);
    });
  });

  it('should raise error if second last name is empty', async () => {
    render(<AddUsers selectedUser={undefined} setSelectedUser={vi.fn()} onUserAdded={vi.fn()} />);
    const { email, name, firstLastName } = getTextInputsByLabelText();

    await userEvent.type(email, faker.internet.email());
    await userEvent.type(name, faker.person.firstName());
    await userEvent.type(firstLastName, faker.person.lastName());
    await userEvent.click(screen.getByRole('button', { name: 'Registrar Usuario' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(validationMessages.secondLastNameRequired);
    });
  });

  it('should raise error if password is empty', async () => {
    render(<AddUsers selectedUser={undefined} setSelectedUser={vi.fn()} onUserAdded={vi.fn()} />);
    const { email, name, firstLastName, secondLastName } = getTextInputsByLabelText();

    await userEvent.type(email, faker.internet.email());
    await userEvent.type(name, faker.person.firstName());
    await userEvent.type(firstLastName, faker.person.lastName());
    await userEvent.type(secondLastName, faker.person.lastName());

    await userEvent.click(screen.getByRole('button', { name: 'Registrar Usuario' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(validationMessages.passwordRequired);
    });
  });

  it('should raise error if password is too short', async () => {
    render(<AddUsers selectedUser={undefined} setSelectedUser={vi.fn()} onUserAdded={vi.fn()} />);
    const { email, name, firstLastName, secondLastName, password } = getTextInputsByLabelText();

    await userEvent.type(email, faker.internet.email());
    await userEvent.type(name, faker.person.firstName());
    await userEvent.type(firstLastName, faker.person.lastName());
    await userEvent.type(secondLastName, faker.person.lastName());
    await userEvent.type(password, '123');
    await userEvent.click(screen.getByRole('button', { name: 'Registrar Usuario' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(validationMessages.passwordLength);
    });
  });

  it('should raise error if confirmation password is empty', async () => {
    render(<AddUsers selectedUser={undefined} setSelectedUser={vi.fn()} onUserAdded={vi.fn()} />);
    const { email, name, firstLastName, secondLastName, password } = getTextInputsByLabelText();

    await userEvent.type(email, faker.internet.email());
    await userEvent.type(name, faker.person.firstName());
    await userEvent.type(firstLastName, faker.person.lastName());
    await userEvent.type(secondLastName, faker.person.lastName());
    await userEvent.type(password, '123456');
    await userEvent.click(screen.getByRole('button', { name: 'Registrar Usuario' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(validationMessages.passwordConfirm);
    });
  });

  it('should raise error if passwords do not match', async () => {
  render(<AddUsers selectedUser={undefined} setSelectedUser={vi.fn()} onUserAdded={vi.fn()} />);
    const { email, name, firstLastName, secondLastName, password, confirmPassword } = getTextInputsByLabelText();

    await userEvent.type(email, faker.internet.email());
    await userEvent.type(name, faker.person.firstName());
    await userEvent.type(firstLastName, faker.person.lastName());
    await userEvent.type(secondLastName, faker.person.lastName());
    await userEvent.type(password, '123456');
    await userEvent.type(confirmPassword, '654321');
    await userEvent.click(screen.getByRole('button', { name: 'Registrar Usuario' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(validationMessages.passwordMismatch);
    });
  });

  it('Debe mostrar el mensaje de usuario creado correctamente', async () => {
    render(<AddUsers selectedUser={undefined} setSelectedUser={vi.fn()} onUserAdded={vi.fn()} />);

    const emailInput = screen.getByLabelText('Correo electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    const confirmPasswordInput = screen.getByLabelText('Confirmar contraseña');
    const nameInput = screen.getByLabelText('Nombre');
    const firstLastNameInput = screen.getByLabelText('Primer Apellido');
    const secondLastNameInput = screen.getByLabelText('Segundo Apellido');
    const submitButton = screen.getByRole('button', { name: 'Registrar Usuario' });

    const fakePassword = faker.internet.password();

    await userEvent.type(emailInput, faker.internet.email());
    await userEvent.type(passwordInput, fakePassword);
    await userEvent.type(confirmPasswordInput, fakePassword);
    await userEvent.type(nameInput, faker.person.firstName());
    await userEvent.type(firstLastNameInput, faker.person.lastName());
    await userEvent.type(secondLastNameInput, faker.person.lastName());

    await userEvent.click(submitButton);

    await waitFor(() => {
      const successMessage = screen.getByRole('alert');
      expect(successMessage).toHaveTextContent('El usuario se ha creado correctamente.');
    });
  });
});
