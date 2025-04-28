import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import ClassGroup from "./ClassGroup";
import { useParams, useNavigate } from "react-router-dom";
import ClassGroupDataService from "../../services/ClassGroupService";

vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock("../../services/ClassGroupService", () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock("./ClassGroupForm", () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="class-group-form">

      <button onClick={props.onSubmit}>Submit Form</button>
    </div>
  ),
}));

describe("ClassGroup", () => {
  const navigateMock = vi.fn();

  beforeEach(() => {

    vi.clearAllMocks();
    useNavigate.mockReturnValue(navigateMock);
  });

  test("renders the editor when no id is provided in the params", () => {

    useParams.mockReturnValue({});
    render(<ClassGroup />);

    expect(screen.getByText(/Editor de Grupos de Clase/i)).toBeInTheDocument();
  });

  test("obtains the class group by providing an id in the params", async () => {

    useParams.mockReturnValue({ id: "123" });
    const fakeData = {
      id: "123",
      course: 1,
      course_module: "Módulo A",
      modality: "Virtual",
      number_students: 20,
      max_students: 25,
      location: "Aula 1",
      weekly_hours: 10,
    };
    ClassGroupDataService.get.mockResolvedValue({ data: fakeData });

    render(<ClassGroup />);

    await waitFor(() => {
      expect(ClassGroupDataService.get).toHaveBeenCalledWith("123");
    });

    expect(screen.getByText(/Editor de Grupos de Clase/i)).toBeInTheDocument();
  });

  test("updates the class group and displays success message when submitting the form", async () => {

    useParams.mockReturnValue({ id: "123" });
    const validData = {
      id: "123",
      course: 1,
      course_module: "Módulo A",
      modality: "Virtual",
      number_students: 20,
      max_students: 25,
      location: "Aula 1",
      weekly_hours: 10,
    };
    ClassGroupDataService.get.mockResolvedValue({ data: validData });
    ClassGroupDataService.update.mockResolvedValue({ data: {} });

    render(<ClassGroup />);

    await waitFor(() => {
      expect(ClassGroupDataService.get).toHaveBeenCalledWith("123");
    });

    const submitButton = screen.getByText("Submit Form");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(ClassGroupDataService.update).toHaveBeenCalledWith("123", validData);
    });
    expect(
      screen.getByText(/El grupo de clase fue actualizado correctamente\./i)
    ).toBeInTheDocument();
  });

  test("shows error when trying to update with invalid data", async () => {

    useParams.mockReturnValue({ id: "123" });
    const invalidData = {
      id: "123",
      course: 0,
      course_module: "",
      modality: "",
      number_students: 0,
      max_students: 0,
      location: "",
      weekly_hours: 0,
    };
    ClassGroupDataService.get.mockResolvedValue({ data: invalidData });

    render(<ClassGroup />);

    await waitFor(() => {
      expect(ClassGroupDataService.get).toHaveBeenCalledWith("123");
    });

    const submitButton = screen.getByText("Submit Form");
    fireEvent.click(submitButton);

    expect(
      screen.getByText(/Todos los campos son obligatorios y deben tener valores válidos\./i)
    ).toBeInTheDocument();

    expect(ClassGroupDataService.update).not.toHaveBeenCalled();
  });

  test("deletes the class group and navigates to the list by clicking on 'Delete'", async () => {

    useParams.mockReturnValue({ id: "123" });
    const fakeData = {
      id: "123",
      course: 1,
      course_module: "Módulo A",
      modality: "Virtual",
      number_students: 20,
      max_students: 25,
      location: "Aula 1",
      weekly_hours: 10,
    };
    ClassGroupDataService.get.mockResolvedValue({ data: fakeData });
    ClassGroupDataService.remove.mockResolvedValue({ data: {} });

    render(<ClassGroup />);

    await waitFor(() => {
      expect(ClassGroupDataService.get).toHaveBeenCalledWith("123");
    });

    const deleteButton = screen.getByText("Borrar");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(ClassGroupDataService.remove).toHaveBeenCalledWith("123");
    });
    expect(navigateMock).toHaveBeenCalledWith("/class-list");
  });

  test("navigate to the list by clicking on 'Show List'.", () => {

    useParams.mockReturnValue({});
    render(<ClassGroup />);
    const showListButton = screen.getByText("Mostrar Lista");
    fireEvent.click(showListButton);
    expect(navigateMock).toHaveBeenCalledWith("/class-list");
  });
});
