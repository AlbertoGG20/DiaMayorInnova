import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ClassGroup from "./ClassGroup";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { role: "admin", school_center_id: "123" }
  }),
}));

import ClassGroupDataService from "../../services/ClassGroupService";
vi.mock("../../services/ClassGroupService", () => ({
  default: {
    update: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("../../components/class-group/ClassGroupForm", () => {
  return {
    default: (props) => (
      <form data-testid="class-group-form" onSubmit={props.handleSubmit}>
        <input
          type="number"
          name="course"
          placeholder="Curso"
          value={props.formData.course}
          onChange={props.handleInputChange}
        />
        <input
          type="text"
          name="course_module"
          placeholder="Módulo"
          value={props.formData.course_module}
          onChange={props.handleInputChange}
        />
        {props.errors.course && <p>{props.errors.course}</p>}
        {props.errors.course_module && <p>{props.errors.course_module}</p>}
        {props.successMessage && <p>{props.successMessage}</p>}
        <button type="submit">Enviar</button>
        <button type="button" onClick={props.onCancelEdit}>Cancelar</button>
      </form>
    ),
  };
});


vi.mock("../../components/class-group/ClassGroupList", () => {
  return {
    default: (props) => (
      <div data-testid="class-group-list">
        Listado - Trigger: {props.refreshTrigger}
        
        <button
          data-testid="simulate-edit"
          onClick={() =>
            props.onEdit({
              id: 1,
              course: 3,
              course_module: "Modulo Editado",
              modality: "",
              number_students: 0,
              max_students: 30,
              location: "",
              weekly_hours: 0,
              school_center_id: ""
            })
          }
        >
          Simular edición
        </button>
      </div>
    ),
  };
});

describe("ClassGroup Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("render header and title correctly", () => {
    render(<ClassGroup />);
    
    const headerButtons = screen.getAllByRole("button");
    expect(headerButtons[0]).toBeInTheDocument();
    expect(screen.getByText("Crear Grupo de Clase")).toBeInTheDocument();
  });

  it('when the “back” button is pressed, navigate is called with “/home”', () => {
    render(<ClassGroup />);
    
    const backButton = screen.getAllByRole("button")[0];
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  it("shows validation errors if required fields are missing", async () => {
    render(<ClassGroup />);
    const form = screen.getByTestId("class-group-form");
    fireEvent.submit(form);
    await waitFor(() => {
      expect(screen.getByText("El curso es obligatorio.")).toBeInTheDocument();
      expect(screen.getByText("El módulo es obligatorio.")).toBeInTheDocument();
    });
  });

  it("creates a group when no id exists and valid data is sent", async () => {
    
    ClassGroupDataService.create.mockResolvedValueOnce({ data: { id: 1 } });
    render(<ClassGroup />);
    const courseInput = screen.getByPlaceholderText("Curso");
    const moduleInput = screen.getByPlaceholderText("Módulo");
    const form = screen.getByTestId("class-group-form");
    
    fireEvent.change(courseInput, { target: { value: "1" } });
    fireEvent.change(moduleInput, { target: { value: "Modulo A" } });
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(ClassGroupDataService.create).toHaveBeenCalled();
      expect(screen.getByText("Grupo creado correctamente")).toBeInTheDocument();
      expect(screen.getByTestId("class-group-list")).toHaveTextContent("Trigger: 1");
    });
  });

  it("updates an existing group when formData has id", async () => {
    ClassGroupDataService.update.mockResolvedValueOnce({ data: { id: 1 } });
    render(<ClassGroup />);

    const simulateEditButton = screen.getByTestId("simulate-edit");
    fireEvent.click(simulateEditButton);

    const courseInput = screen.getByPlaceholderText("Curso");
    const moduleInput = screen.getByPlaceholderText("Módulo");

    expect(courseInput.value).toBe("3");
    expect(moduleInput.value).toBe("Modulo Editado");

    fireEvent.change(courseInput, { target: { value: "4" } });
    fireEvent.change(moduleInput, { target: { value: "Modulo Actualizado" } });

    const form = screen.getByTestId("class-group-form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(ClassGroupDataService.update).toHaveBeenCalledWith(
        1,
        { class_group: expect.objectContaining({
            id: 1,
            course: "4",
            course_module: "Modulo Actualizado"
          })
        }
      );
      expect(screen.getByText("Grupo actualizado correctamente")).toBeInTheDocument();
    });
  });

  it("restarts the form when cancelling the edition", async () => {
    render(<ClassGroup />);
    const courseInput = screen.getByPlaceholderText("Curso");
    const moduleInput = screen.getByPlaceholderText("Módulo");

    fireEvent.change(courseInput, { target: { value: "5" } });
    fireEvent.change(moduleInput, { target: { value: "Modulo X" } });

    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    expect(courseInput.value).toBe("0");
    expect(moduleInput.value).toBe("");
  });
});
