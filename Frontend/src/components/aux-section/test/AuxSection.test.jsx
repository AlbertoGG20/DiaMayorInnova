import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';
import { AuxSection } from '../AuxSection';
import { MemoryRouter } from 'react-router-dom';

describe('auxSection Component for Practice ', () => {

  const mockStatement = [
    {
      "id": 7,
      "definition": "01/08 Hace un pedido a un proveedor de 200 unidades del producto ROJO a 15 € la unidad. El proveedor nos solicita un anticipo por lo que le transferimos por banco 1.284 €.",
      "explanation": "",
      "created_at": "2025-03-13T14:07:18.498Z",
      "updated_at": "2025-03-13T14:07:18.498Z",
      "user_id": 2,
      "is_public": false
    },
    {
      "id": 8,
      "definition": "03/08 Llega el pedido anterior junto con la factura en la que se incluye un descuento comercial de 2%,además de 200 envases SIN facultad de devolución a 0,25 € la unidad. En las condiciones comerciales se indica que el pago se realizará a final de mes.",
      "explanation": "Aplica el anticipo",
      "created_at": "2025-03-13T14:07:18.503Z",
      "updated_at": "2025-03-13T14:07:18.503Z",
      "user_id": 2,
      "is_public": false
    }
  ];

  const mockSelectStatement =
  {
    "id": 7,
    "definition": "01/08 Hace un pedido a un proveedor de 200 unidades del producto ROJO a 15 € la unidad. El proveedor nos solicita un anticipo por lo que le transferimos por banco 1.284 €.",
    "explanation": "",
    "created_at": "2025-03-13T14:07:18.498Z",
    "updated_at": "2025-03-13T14:07:18.498Z",
    "user_id": 2,
    "is_public": false
  }

  //On Practice Page

  it('Render the component', () => {
    const route = '/modes/practica'
    render(
      <MemoryRouter initialEntries={[route]}>
        <AuxSection
          helpAvailable={true}
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: /Ayuda/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Diario Mayor/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Balance/i })).toBeInTheDocument();
  })

  it('In practice, change component when click on Diario Mayor button', async () => {
    const route = '/modes/practica'
    render(
      <MemoryRouter initialEntries={[route]}>
        <AuxSection />
      </MemoryRouter>,
    );
    const diarioButton = screen.getByRole('button', { name: /Diario Mayor/i });
    fireEvent.click(diarioButton);

    await waitFor(() => {
      expect(screen.getByText(/Pestaña Diario Mayor/i)).toBeInTheDocument();
    });
  })

  it('In practice, change  the component when click on Balance button', async () => {
    const route = '/modes/practica'
    render(
      <MemoryRouter initialEntries={[route]}>
        <AuxSection />
      </MemoryRouter>,
    );
    const balanceButton = screen.getByRole('button', { name: /Balance/i });
    fireEvent.click(balanceButton);

    await waitFor(() => {
      expect(screen.getByText(/Pestaña Balance/i)).toBeInTheDocument();
    });
  })

  it('In practice, click the Ayuda bottom and change the component', async () => {
    const route = '/modes/practice'
    render(
      <MemoryRouter initialEntries={[route]}>
        <AuxSection
          helpAvailable={true}
        />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText(/Ayuda/i)).toBeInTheDocument();
    });

    const helpButton = screen.getByRole('button', { name: /Ayuda/i });
    fireEvent.click(helpButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Buscar cuenta/i)).toBeInTheDocument();
    });
  })

  //On Task Page

  it('In Task, change  the component when click on Balance button', async () => {
    const route = '/modes/tarea/1'
    render(
      <MemoryRouter initialEntries={[route]}>
        <AuxSection />
      </MemoryRouter>,
    );
    const balanceButton = screen.getByRole('button', { name: /Balance/i });
    fireEvent.click(balanceButton);

    await waitFor(() => {
      expect(screen.getByText(/Pestaña Balance/i)).toBeInTheDocument();
    });
  })

  it('In Task, change  the component when click on Pestaña Mayor button ', async () => {
    const route = '/modes/tarea/1'
    render(
      <MemoryRouter initialEntries={[route]}>
        <AuxSection />
      </MemoryRouter>,
    );
    const mayorButton = screen.getByRole('button', { name: /Diario Mayor/i });
    fireEvent.click(mayorButton);

    await waitFor(() => {
      expect(screen.getByText(/Pestaña Diario Mayor/i)).toBeInTheDocument();
    });
  })

  it('In Task, change  the component when click on Enunciados button ', async () => {
    const route = '/modes/tarea/1'
    render(
      <MemoryRouter initialEntries={[route]}>
        <AuxSection
          statements={mockStatement}
          onSelectStatement={mockSelectStatement}
          examStarted={true}
        />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText(/Enunciados/i)).toBeInTheDocument();
    });

    const statementButton = screen.getByRole('button', { name: /Enunciados/i });
    fireEvent.click(statementButton);

    //Preview of the statements in number
    await waitFor(() => {
      expect(screen.getByText(/1/i)).toBeInTheDocument();
      expect(screen.getByText(/2/i)).toBeInTheDocument();
    });
  })

  it('In Task, when help is available,the Ayuda button is visible and when click on it, change the component', async () => {
    const route = '/modes/tarea/1'
    render(
      <MemoryRouter initialEntries={[route]}>
        <AuxSection
          statements={mockStatement}
          onSelectStatement={mockSelectStatement}
          examStarted={true}
          helpAvailable={true}
        />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText(/Ayuda/i)).toBeInTheDocument();
    });

    const helpButton = screen.getByRole('button', { name: /Ayuda/i });
    fireEvent.click(helpButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Buscar cuenta/i)).toBeInTheDocument();
    });
  })

  it('In Task, when help is disable,the button is not visible', async () => {
    const route = '/modes/tarea/1'
    render(
      <MemoryRouter initialEntries={[route]}>
        <AuxSection
          statements={mockStatement}
          onSelectStatement={mockSelectStatement}
          examStarted={true}
          helpAvailable={false}
        />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: /Ayuda/i })).not.toBeInTheDocument();
  })


  //On Exam Page

  it('In Exam,show the Enunciados button and change the component when click on it ', async () => {
    const route = '/modes/examen/1'
    render(
      <MemoryRouter initialEntries={[route]}>
        <AuxSection
          statements={mockStatement}
          onSelectStatement={mockSelectStatement}
          examStarted={true}
          helpAvailable={false}
        />
      </MemoryRouter>,
    );
    const statementButton = screen.getByRole('button', { name: /Enunciados/i });
    fireEvent.click(statementButton);

    //Preview of the statements in number
    await waitFor(() => {
      expect(screen.getByText(/1/i)).toBeInTheDocument();
      expect(screen.getByText(/2/i)).toBeInTheDocument();
    });
  })

  it('In Exam,the statements are not shown when the exam has not started', async () => {
    const route = '/modes/examen/1'
    render(
      <MemoryRouter initialEntries={[route]}>
        <AuxSection
          statements={mockStatement}
          onSelectStatement={mockSelectStatement}
          examStarted={false}
          helpAvailable={false}
        />
      </MemoryRouter>,
    );

    const statementButton = screen.getByRole('button', { name: /Enunciados/i });
    fireEvent.click(statementButton);

    //Preview of the statements in number
    await waitFor(() => {
      expect(screen.queryByText(/1/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/2/i)).not.toBeInTheDocument();
    });
  })

  it('In Exam,ayuda button is not visible', async () => {
    const route = '/modes/examen/1'
    render(
      <MemoryRouter initialEntries={[route]}>
        <AuxSection
          statements={mockStatement}
          onSelectStatement={mockSelectStatement}
          examStarted={true}
        />
      </MemoryRouter>,
    );

    expect(screen.queryByRole('button', { name: /Ayuda/i })).not.toBeInTheDocument();
  })
})

