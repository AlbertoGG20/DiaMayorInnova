import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import ClassGroupsList from "./ClassGroupList";

import ClassGroupService from "../../services/ClassGroupService";
vi.mock("../../services/ClassGroupService", () => ({
  default: {
    getAll: vi.fn(),
    remove: vi.fn(),
    updateClassGroupUsers: vi.fn(),
  },
}));

import userService from "../../services/userService";
vi.mock("../../services/userService", () => {
  return {
    default: {
      getCurrentUser: vi.fn(),
      getTeacherClassGroups: vi.fn(),
      getUserByClassId: vi.fn(),
    },
  };
});

vi.mock("../modal/ConfirmDeleteModal", () => ({
  default: ({ isOpen, title, message, onDelete, onClose }) =>
    isOpen ? (
      <div data-testid="confirm-delete-modal">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onDelete}>Confirmar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    ) : null,
}));

vi.mock("../assignUsersToClass/AssignUserToClass", () => ({
  default: (props) => (
    <div data-testid="assign-user">
      <button onClick={() => props.onSave(props.classGroupId, [1, 2, 3])}>
        Simular Guardar Asignación
      </button>
    </div>
  ),
}));

describe("ClassGroupsList Component", () => {
  const sampleGroups = [
    {
      id: 1,
      course: 10,
      course_module: "Module 1",
      modality: "Online",
      number_students: 20,
      max_students: 30,
      location: "Room A",
      weekly_hours: 15,
      school_center_id: "SC1",
    },
    {
      id: 2,
      course: 11,
      course_module: "Module 2",
      modality: "Offline",
      number_students: 25,
      max_students: 35,
      location: "Room B",
      weekly_hours: 20,
      school_center_id: "SC2",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading message while obtaining groups", async () => {

    ClassGroupService.getAll.mockReturnValue(new Promise(() => {}));
    userService.getCurrentUser.mockResolvedValue({ role: "admin" });
    render(
      <ClassGroupsList
        refreshTrigger={0}
        onEdit={vi.fn()}
        onStudentCountChange={vi.fn()}
        maxStudents={30}
      />
    );
    expect(screen.getByText("Cargando grupos de clase...")).toBeInTheDocument();
  });

  it("displays message when no class groups have been created", async () => {
    ClassGroupService.getAll.mockResolvedValue({ data: [] });
    userService.getCurrentUser.mockResolvedValue({ role: "admin" });
    render(
      <ClassGroupsList
        refreshTrigger={0}
        onEdit={vi.fn()}
        onStudentCountChange={vi.fn()}
        maxStudents={30}
      />
    );
    await waitFor(() => {
      expect(screen.getByText("No hay grupos de clase creados.")).toBeInTheDocument();
    });
  });

  it("displays the list of groups correctly", async () => {
    ClassGroupService.getAll.mockResolvedValue({ data: sampleGroups });
    userService.getCurrentUser.mockResolvedValue({ role: "admin" });
    render(
      <ClassGroupsList
        refreshTrigger={0}
        onEdit={vi.fn()}
        onStudentCountChange={vi.fn()}
        maxStudents={30}
      />
    );
    await waitFor(() => {
      expect(screen.getByText("Lista de Grupos de Clase")).toBeInTheDocument();

      sampleGroups.forEach((group) => {
        expect(screen.getByText(group.course.toString())).toBeInTheDocument();
        expect(screen.getByText(group.course_module)).toBeInTheDocument();
      });
    });
  });

  it("calls onEdit when you click the Edit button", async () => {
    const onEditMock = vi.fn();
    ClassGroupService.getAll.mockResolvedValue({ data: sampleGroups });
    userService.getCurrentUser.mockResolvedValue({ role: "admin" });
    render(
      <ClassGroupsList
        refreshTrigger={0}
        onEdit={onEditMock}
        onStudentCountChange={vi.fn()}
        maxStudents={30}
      />
    );
    await waitFor(() => {
      expect(screen.getByText("Lista de Grupos de Clase")).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText("Editar");
    fireEvent.click(editButtons[0]);
    expect(onEditMock).toHaveBeenCalledWith(sampleGroups[0]);
  });

  it("opens the confirmation modal by clicking on the Delete button", async () => {
    ClassGroupService.getAll.mockResolvedValue({ data: sampleGroups });
    userService.getCurrentUser.mockResolvedValue({ role: "admin" });
    render(
      <ClassGroupsList
        refreshTrigger={0}
        onEdit={vi.fn()}
        onStudentCountChange={vi.fn()}
        maxStudents={30}
      />
    );
    await waitFor(() => {
      expect(screen.getByText("Lista de Grupos de Clase")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText("Eliminar");
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(screen.getByTestId("confirm-delete-modal")).toBeInTheDocument();
      expect(screen.getByText(/El grupo de clase con curso/)).toBeInTheDocument();
    });
  });

  it("calls ClassGroupService.remove on confirmation of removal", async () => {
    ClassGroupService.getAll.mockResolvedValue({ data: sampleGroups });
    ClassGroupService.remove.mockResolvedValue({});
    userService.getCurrentUser.mockResolvedValue({ role: "admin" });
    render(
      <ClassGroupsList
        refreshTrigger={0}
        onEdit={vi.fn()}
        onStudentCountChange={vi.fn()}
        maxStudents={30}
      />
    );
    await waitFor(() => {
      expect(screen.getByText("Lista de Grupos de Clase")).toBeInTheDocument();
    });
    const deleteButtons = screen.getAllByText("Eliminar");
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(screen.getByTestId("confirm-delete-modal")).toBeInTheDocument();
    });

    const confirmButton = screen.getByText("Confirmar");
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(ClassGroupService.remove).toHaveBeenCalledWith(sampleGroups[0].id);
    });
  });

  it("handles the assignment of users to a group", async () => {

    ClassGroupService.getAll.mockResolvedValue({ data: sampleGroups });
    userService.getCurrentUser.mockResolvedValue({ role: "admin" });
    const onStudentCountChangeMock = vi.fn();
    render(
      <ClassGroupsList
        refreshTrigger={0}
        onEdit={vi.fn()}
        onStudentCountChange={onStudentCountChangeMock}
        maxStudents={30}
      />
    );
    await waitFor(() => {
      const assignButtons = screen.getAllByTestId("assign-user");
      expect(assignButtons.length).toBeGreaterThan(0);
    });

    const assignButtons = screen.getAllByText("Simular Guardar Asignación");
    expect(assignButtons.length).toBeGreaterThan(0);
    fireEvent.click(assignButtons[0]);
    await waitFor(() => {
      expect(ClassGroupService.updateClassGroupUsers).toHaveBeenCalledWith(
        sampleGroups[0].id,
        { users: [1, 2, 3] }
      );
    });
  });
});
