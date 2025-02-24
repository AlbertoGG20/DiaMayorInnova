import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { expect, vi } from "vitest";
import StudentMark from "../StudentMark";
import userExerciseDataService from "../../../services/userExerciseDataService";


vi.mock("../../../services/userExerciseDataService", () => ({
  default: {
    getAllCalification: vi.fn(),
  },
}));


describe("Componente StudentMark", () => {

  const mockData = [
    {
      id: 4,
      total_mark: 7.5,
      task: { title: "Contabiliza en el libro diario las operaciones que la empresa GAMONAL SL realiza durante el año 20X4" },
      marks: [
        {
          mark: "10.0",
          statement_id: 7,
          student_entries: [
            {
              entry_number: 1,
              entry_date: "2024-08-01",
              student_annotations: [
                {
                  id: 4,
                  account_id: 8,
                  number: 1,
                  account_number: 407,
                  credit: 0,
                  debit: 1200,
                  created_at: "2025-02-19T13:12:16.228Z",
                  updated_at: "2025-02-19T13:12:16.228Z",
                  student_entry_id: 5
                }
              ]
            },
          ],
        },
        {
          mark: "5.0",
          statement_id: 8,
          student_entries: [
            {
              entry_number: 2,
              entry_date: "2024-08-03",
              student_annotations: [
                {
                  id: 4,
                  account_id: 8,
                  number: 1,
                  account_number: 407,
                  credit: 0,
                  debit: 1200,
                  created_at: "2025-02-19T13:12:16.228Z",
                  updated_at: "2025-02-19T13:12:16.228Z",
                  student_entry_id: 5
                },
                {
                  id: 5,
                  account_id: 32,
                  number: 2,
                  account_number: 4727,
                  credit: 100,
                  debit: 84,
                  created_at: "2025-02-19T13:12:16.233Z",
                  updated_at: "2025-02-19T13:12:16.233Z",
                  student_entry_id: 5
                },
              ]
            },
          ],
        },
      ],
    },
  ];

  beforeEach(() => {
    userExerciseDataService.getAllCalification.mockResolvedValue({ data: mockData });
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  })


  test("Renderiza correctamente el componente <StudentMark />'", async () => {
    render(<StudentMark />);
    expect(screen.getByText("Calificaciones")).toBeInTheDocument();
  });

  test("No muestra notas cuando `getAllCalification` devuelve un array vacío", async () => {
    userExerciseDataService.getAllCalification.mockResolvedValue({ data: [] });
    render(<StudentMark />);
    await waitFor(() => {
      expect(screen.queryByText("-")).not.toBeInTheDocument();
      expect(screen.queryByText(/7.5/)).not.toBeInTheDocument();
    });

  });

  test("Abre el modal al hacer clic en una calificación", async () => {
    render(<StudentMark />);

    await waitFor(() => {
      const markElement = screen.getByTestId('mark-4');
      fireEvent.click(markElement);
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /x/i }));
    });
  });

  test("Muestra datos correctamente en el modal cuando la API devuelve información", async () => {
    render(<StudentMark />);

    await waitFor(() => {
      const markElement = screen.getByTestId('mark-4');
      fireEvent.click(markElement);
    });

    await waitFor(() => {
      expect(screen.getByText("Fecha 2024-08-03")).toBeInTheDocument();
      expect(screen.getByText("Fecha 2024-08-01")).toBeInTheDocument();
    });
  });

});