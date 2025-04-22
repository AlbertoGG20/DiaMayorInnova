import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import EntryHeader from '../entry-header/EntryHeader';

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

describe('EntryHeader Component', () => {
  it('renders the component correctly', () => {
    render(<EntryHeader addEntry={() => { }} />);

    expect(screen.getByText('Asientos Contables')).toBeInTheDocument();
    expect(screen.getByText('Asiento')).toBeInTheDocument();
  });

  it('calls addEntry when button is clicked and a statement is selected', () => {
    const mockAddEntry = vi.fn();
    const mockStatement = { id: 'statement-1' };

    render(
      <EntryHeader
        addEntry={mockAddEntry}
        selectedStatement={mockStatement}
        exerciseStarted={true}
      />
    );

    fireEvent.click(screen.getByText('Asiento'));
    expect(mockAddEntry).toHaveBeenCalledWith('statement-1');
  });

  it('shows modal when button is clicked and no statement is selected', () => {
    render(<EntryHeader addEntry={() => { }} selectedStatement={null} />);

    fireEvent.click(screen.getByText('Asiento'));
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    expect(screen.getByText('Por favor, selecciona un enunciado antes de agregar un asiento.')).toBeInTheDocument();
  });

  it('disables add button when exerciseStarted is false', () => {
    render(
      <EntryHeader
        addEntry={() => { }}
        selectedStatement={{ id: 'statement-1' }}
        exerciseStarted={false}
      />
    );

    const button = screen.getByText('Asiento');
    expect(button).toBeDisabled();
  });

  it('enables add button when exerciseStarted is true', () => {
    render(
      <EntryHeader
        addEntry={() => { }}
        selectedStatement={{ id: 'statement-1' }}
        exerciseStarted={true}
      />
    );

    const button = screen.getByText('Asiento');
    expect(button).toBeEnabled();
  });
});