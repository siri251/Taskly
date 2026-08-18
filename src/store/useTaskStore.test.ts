import { useTaskStore } from '../store/useTaskStore';

beforeEach(() => {
  useTaskStore.getState().reset();
});

describe('addTask', () => {
  it.each([
    ['todo', 'todo'],
    ['inprogress', 'inprogress'],
    ['done', 'done'],
  ] as const)('creates a task under the "%s" column', (status, expectedColumn) => {
    const id = useTaskStore.getState().addTask({ title: 'Task', description: '', status });
    const state = useTaskStore.getState();

    expect(state.tasksById[id].status).toBe(status);
    expect(state.columns[expectedColumn]).toContain(id);
  });

  it('throws when title is empty or only whitespace', () => {
    const { addTask } = useTaskStore.getState();
    expect(() => addTask({ title: '   ', description: '', status: 'todo' })).toThrow(
      'Task title cannot be empty'
    );
  });
});

describe('updateTask', () => {
  it('edits title/description without moving the task when status is unchanged', () => {
    const { addTask, updateTask } = useTaskStore.getState();
    const id = addTask({ title: 'Original', description: '', status: 'todo' });

    updateTask(id, { title: 'Updated' });

    const state = useTaskStore.getState();
    expect(state.tasksById[id].title).toBe('Updated');
    expect(state.columns.todo).toEqual([id]);
  });

  it('moves the task to the new column when status changes', () => {
    const { addTask, updateTask } = useTaskStore.getState();
    const id = addTask({ title: 'Task', description: '', status: 'todo' });

    updateTask(id, { status: 'inprogress' });

    const state = useTaskStore.getState();
    expect(state.columns.todo).not.toContain(id);
    expect(state.columns.inprogress).toContain(id);
    expect(state.tasksById[id].status).toBe('inprogress');
  });
});

describe('deleteTask', () => {
  it('removes the task from tasksById and its column, leaving other tasks intact', () => {
    const { addTask, deleteTask } = useTaskStore.getState();
    const keep = addTask({ title: 'Keep', description: '', status: 'todo' });
    const remove = addTask({ title: 'Remove', description: '', status: 'todo' });

    deleteTask(remove);

    const state = useTaskStore.getState();
    expect(state.tasksById[remove]).toBeUndefined();
    expect(state.columns.todo).toEqual([keep]);
  });
});

describe('moveTask', () => {
  it('moves a task across columns and updates its status', () => {
    const { addTask, moveTask } = useTaskStore.getState();
    const id = addTask({ title: 'Task', description: '', status: 'todo' });

    moveTask(id, { status: 'todo', index: 0 }, { status: 'inprogress', index: 0 });

    const state = useTaskStore.getState();
    expect(state.columns.todo).not.toContain(id);
    expect(state.columns.inprogress).toEqual([id]);
    expect(state.tasksById[id].status).toBe('inprogress');
  });
});