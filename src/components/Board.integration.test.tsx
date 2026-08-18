import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Board } from '../components/Board';
import { useTaskStore } from '../store/useTaskStore';

beforeEach(() => {
  useTaskStore.getState().reset();
});

describe('creating a task via the UI', () => {
  it('adds a new task card to the column it was created in', async () => {
    const user = userEvent.setup();
    render(<Board />);

    await user.click(screen.getByRole('button', { name: 'Add task to To Do' }));

    const form = screen.getByTestId('task-form');
    await user.type(within(form).getByLabelText('Title'), 'Write integration tests');
    await user.click(within(form).getByRole('button', { name: 'Add ticket' }));

    const updatedTodoColumn = screen.getByTestId('column-todo');
    expect(within(updatedTodoColumn).getByText('Write integration tests')).toBeInTheDocument();
  });

  it('shows a validation error and does not create a task when title is empty', async () => {
    const user = userEvent.setup();
    render(<Board />);

    await user.click(screen.getByRole('button', { name: 'Add task to To Do' }));

    const form = screen.getByTestId('task-form');
    await user.click(within(form).getByRole('button', { name: 'Add ticket' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Give this ticket a title before filing it.');
    expect(useTaskStore.getState().columns.todo).toHaveLength(0);
  });
});

describe('editing a task via the UI', () => {
  it('moves the card to a new column when its status is changed in the modal', async () => {
    const user = userEvent.setup();
    useTaskStore.getState().addTask({
      title: 'Task to move',
      description: '',
      status: 'todo',
    });
    render(<Board />);

    await user.click(screen.getByRole('button', { name: 'Edit Task to move' }));

    const form = screen.getByTestId('task-form');
    await user.click(within(form).getByRole('button', { name: 'In Progress' }));
    await user.click(within(form).getByRole('button', { name: 'Save changes' }));

    const inProgressColumn = screen.getByTestId('column-inprogress');
    expect(within(inProgressColumn).getByText('Task to move')).toBeInTheDocument();

    const todoColumn = screen.getByTestId('column-todo');
    expect(within(todoColumn).queryByText('Task to move')).not.toBeInTheDocument();
  });
});

describe('deleting a task via the UI', () => {
  it('removes the card only after the confirmation dialog is confirmed', async () => {
    const user = userEvent.setup();
    const id = useTaskStore.getState().addTask({
      title: 'Task to delete',
      description: '',
      status: 'done',
    });
    render(<Board />);

    await user.click(screen.getByRole('button', { name: 'Delete Task to delete' }));
    const dialog = screen.getByRole('alertdialog');
    expect(screen.getByTestId(`task-card-${id}`)).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Delete' }));

    expect(screen.queryByTestId(`task-card-${id}`)).not.toBeInTheDocument();
  });
});
