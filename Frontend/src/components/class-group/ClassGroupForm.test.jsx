import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import ClassGroupForm from "./ClassGroupForm";
import { useAuth } from "../../context/AuthContext";
import SchoolsServices from "../../services/SchoolsServices";

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../services/SchoolsServices", () => ({
  __esModule: true,
  default: {
    getAll: vi.fn(),
  }
}));

describe("ClassGroupForm", () => {
  const defaultProps = {
    formData: {
      course: "",
      course_module: "",
      modality: "",
      location: "",
      number_students: "",
      max_students: "",
      weekly_hours: "",
      school_center_id: "",
    },
    handleInputChange: vi.fn(),
    handleSubmit: vi.fn((e) => e.preventDefault()),
    errors: {},
    successMessage: "",
    onCancelEdit: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("correctly renders form fields in create mode for non-admin user", () => {

    useAuth.mockReturnValue({
      user: { role: "user", school_center_id: "1" },
    });

    render(<ClassGroupForm {...defaultProps} />);

    expect(screen.getByLabelText(/Curso/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Módulo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Modalidad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Aula/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nº Estudiantes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Máx\. estudiantes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Hrs\/semana/i)).toBeInTheDocument();

    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
  });

  test("render select schools for admin user", async () => {
    useAuth.mockReturnValue({
      user: { role: "admin" },
    });

    const mockCenters = [
      { id: "1", school_name: "Centro Uno" },
      { id: "2", school_name: "Centro Dos" },
    ];
    SchoolsServices.getAll.mockResolvedValue({ data: mockCenters });

    render(<ClassGroupForm {...defaultProps} />);

    await waitFor(() => {
      expect(SchoolsServices.getAll).toHaveBeenCalled();
    });

    const select = screen.getByLabelText(/Centro Escolar/i);
    expect(select).toBeInTheDocument();
    expect(select).toHaveTextContent("Centro Uno");
    expect(select).toHaveTextContent("Centro Dos");
  });

  test("invokes handleSubmit when submitting the form", () => {
    useAuth.mockReturnValue({
      user: { role: "user", school_center_id: "1" },
    });
    const handleSubmit = vi.fn((e) => e.preventDefault());
    const props = { ...defaultProps, handleSubmit };

    render(<ClassGroupForm {...props} />);

    const { container } = render(<ClassGroupForm {...props} />);
    const form = container.querySelector("form");
    fireEvent.submit(form);
    expect(handleSubmit).toHaveBeenCalled();
  });

  test("invokes handleInputChange when modifying an input", () => {
    useAuth.mockReturnValue({
      user: { role: "user", school_center_id: "1" },
    });
    const handleInputChange = vi.fn();
    const props = { ...defaultProps, handleInputChange };

    render(<ClassGroupForm {...props} />);
    const courseInput = screen.getByLabelText(/Curso/i);
    fireEvent.change(courseInput, { target: { value: "2021" } });
    expect(handleInputChange).toHaveBeenCalled();
  });

  test("renders cancel button in edit mode and invokes it when clicked", () => {
    useAuth.mockReturnValue({
      user: { role: "user", school_center_id: "1" },
    });
    const formData = { ...defaultProps.formData, id: "123" };
    const onCancelEdit = vi.fn();
    const props = { ...defaultProps, formData, onCancelEdit };

    render(<ClassGroupForm {...props} />);
    const cancelButton = screen.getByRole("button", { name: /Cancelar/i });
    expect(cancelButton).toBeInTheDocument();

    fireEvent.click(cancelButton);
    expect(onCancelEdit).toHaveBeenCalled();
  });

  test("displays error messages when provided in props", () => {
    useAuth.mockReturnValue({
      user: { role: "user", school_center_id: "1" },
    });
    const errors = {
      course: "Error en el curso",
      course_module: "Error en el módulo",
    };
    const props = { ...defaultProps, errors };

    render(<ClassGroupForm {...props} />);
    expect(screen.getByText(/Error en el curso/i)).toBeInTheDocument();
    expect(screen.getByText(/Error en el módulo/i)).toBeInTheDocument();
  });

  test("displays success message when provided in props", () => {
    useAuth.mockReturnValue({
      user: { role: "user", school_center_id: "1" },
    });
    const props = { ...defaultProps, successMessage: "Operación exitosa" };

    render(<ClassGroupForm {...props} />);
    expect(screen.getByText(/Operación exitosa/i)).toBeInTheDocument();
  });

  test("renders the correct title according to the mode (create/edit)", () => {
    useAuth.mockReturnValue({
      user: { role: "user", school_center_id: "1" },
    });

    const { rerender } = render(<ClassGroupForm {...defaultProps} />);
    expect(screen.getByRole("heading", { name: /Crear Grupo de Clase/i })).toBeInTheDocument();

    const editFormData = { ...defaultProps.formData, id: "456" };
    rerender(<ClassGroupForm {...defaultProps} formData={editFormData} />);
    expect(screen.getByRole("heading", { name: /Editar Grupo de Clase/i })).toBeInTheDocument();
  });
});
