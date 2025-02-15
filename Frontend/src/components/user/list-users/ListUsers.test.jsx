import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ListUsers from "./ListUsers";
import ConfirmDeleteModal from "../../modal/ConfirmDeleteModal";
import { faker } from '@faker-js/faker';

const fakeEmail1 = faker.internet.email();
const fakeName1 = faker.person.firstName();
const fakeEmail2 = faker.internet.email();
const fakeName2 = faker.person.firstName();

const mockUsers = [
  { id: 1, name: fakeName1, email: fakeEmail1, role: "student" },
  { id: 2, name: fakeName2, email: fakeEmail2, role: "teacher" }
];

it("Debe renderizar la lista de usuarios", () => {
  render(<ListUsers users={mockUsers} setUsers={() => { }} setSelectedUser={() => { }} />);

  expect(screen.getByText(fakeName1)).toBeInTheDocument();
  expect(screen.getByText(`(${fakeEmail1})`)).toBeInTheDocument();
  expect(screen.getByText("student")).toBeInTheDocument();
  expect(screen.getByText(fakeName2)).toBeInTheDocument();
  expect(screen.getByText(`(${fakeEmail1})`)).toBeInTheDocument();
  expect(screen.getByText("teacher")).toBeInTheDocument();
});

it("Debe llamar a setSelectedUser cuando se hace clic en editar", async () => {
  const setSelectedUser = vi.fn();
  render(<ListUsers users={mockUsers} setUsers={() => { }} setSelectedUser={setSelectedUser} />);

  fireEvent.click(screen.getAllByText('Editar')[0]);
  expect(setSelectedUser).toHaveBeenCalledWith(mockUsers[0]);
});

it("Debe abrir la modal cuando se hace clic en eliminar", () => {
  render(
    <>
      <ListUsers users={mockUsers} setUsers={() => { }} setSelectedUser={() => { }} />
      <ConfirmDeleteModal isOpen={true} user={mockUsers[0]} onDelete={() => { }} onClose={() => { }} />
    </>
  );

  expect(screen.getByText(/Estás seguro de que deseas eliminar al usuario:/i)).toBeInTheDocument();
})

it("Debe llamar a handleDeleteClick cuando se hace clic en eliminar", async () => {
  const handleDeleteClick = vi.fn();
  render(<ListUsers users={mockUsers} setUsers={() => { }} setSelectedUser={handleDeleteClick} />);

  const deleteButton = screen.getAllByText("Eliminar")[0];
  await userEvent.click(deleteButton);

  expect(screen.getByText(fakeName2)).toBeInTheDocument();
});



