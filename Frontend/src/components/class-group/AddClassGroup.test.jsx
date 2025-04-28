import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import AddClassGroup from "./AddClassGroup";
import { useNavigate } from "react-router-dom";
import ClassGroupDataService from "../../services/ClassGroupService";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("../../services/ClassGroupService", () => ({
  __esModule: true,
  default: {
    create: vi.fn(),
  },
}));

vi.mock("./ClassGroupForm", () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="class-group-form">
      <button onClick={props.onSubmit}>Submit Form</button>
      <button
        onClick={() =>
          props.onChange({
            id: null,
            course: 1,
            course_module: "Module A",
            modality: "Online",
            number_students: 10,
            max_students: 15,
            location: "Room 101",
            weekly_hours: 5,
          })
        }
      >
        Simulate Valid Input
      </button>
    </div>
  ),
}));

describe("AddClassGroup", () => {
  const navigateMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigateMock);
  });

  test("renders initial component correctly", () => {
    render(<AddClassGroup />);
    expect(screen.getByText(/Añadir Grupos de Clase/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Mostrar la lista de Grupos de clase/i)
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/Todos los campos son obligatorios y deben tener valores válidos\./i)
    ).not.toBeInTheDocument();
  });

  test("navigates to class list on 'Mostrar la lista de Grupos de clase' click", () => {
    render(<AddClassGroup />);
    const listButton = screen.getByText(/Mostrar la lista de Grupos de clase/i);
    fireEvent.click(listButton);
    expect(navigateMock).toHaveBeenCalledWith("/class-list");
  });

  test("shows validation error on submission with invalid data", () => {
    render(<AddClassGroup />);

    const submitButton = screen.getByText("Submit Form");
    fireEvent.click(submitButton);
    expect(
      screen.getByText(/Todos los campos son obligatorios y deben tener valores válidos\./i)
    ).toBeInTheDocument();
  });

  test("submits valid form and shows success message", async () => {
    const validResponse = {
      data: {
        id: "101",
        course: "1",
        course_module: "Module A",
        modality: "Online",
        number_students: "10",
        max_students: "15",
        location: "Room 101",
        weekly_hours: "5",
      },
    };
    ClassGroupDataService.create.mockResolvedValue(validResponse);

    render(<AddClassGroup />);

    const simulateButton = screen.getByText("Simulate Valid Input");
    fireEvent.click(simulateButton);

    const submitButton = screen.getByText("Submit Form");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(ClassGroupDataService.create).toHaveBeenCalledWith({
        course: 1,
        course_module: "Module A",
        modality: "Online",
        number_students: 10,
        max_students: 15,
        location: "Room 101",
        weekly_hours: 5,
      });
    });

    await waitFor(() => {
      expect(screen.getByText(/Se ha enviado correctamente/i)).toBeInTheDocument();
    });
  });

  test("resets state when clicking 'Añadir otro grupo'", async () => {
    const validResponse = {
      data: {
        id: "101",
        course: "1",
        course_module: "Module A",
        modality: "Online",
        number_students: "10",
        max_students: "15",
        location: "Room 101",
        weekly_hours: "5",
      },
    };
    ClassGroupDataService.create.mockResolvedValue(validResponse);

    render(<AddClassGroup />);
    
    const simulateButton = screen.getByText("Simulate Valid Input");
    fireEvent.click(simulateButton);
    const submitButton = screen.getByText("Submit Form");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Se ha enviado correctamente/i)).toBeInTheDocument();
    });

    const addAnotherButton = screen.getByText("Añadir otro grupo");
    fireEvent.click(addAnotherButton);

    expect(screen.getByText(/Añadir Grupos de Clase/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Se ha enviado correctamente/i)
    ).not.toBeInTheDocument();
  });
});
