import type { Todo } from '../types';

interface Props {
  todos: Todo[];
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loadingIds: Set<string>;
}

export function TodoList({ todos, onToggle, onDelete, loadingIds }: Props) {
  if (!todos.length) {
    return <p style={{ textAlign: 'center', color: '#64748b' }}>No tasks yet. Add your first one!</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {todos.map((todo) => {
        const isBusy = loadingIds.has(todo.id);
        return (
          <li
            key={todo.id}
            className={`todo-item ${todo.completed ? 'completed' : ''}`}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>{todo.title}</span>
              <small style={{ color: '#94a3b8' }}>
                Created {new Date(todo.createdAt).toLocaleString()}
              </small>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => onToggle(todo.id)}
                disabled={isBusy}
                style={{
                  background: todo.completed ? '#0f766e' : '#1d4ed8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 0.75rem'
                }}
              >
                {todo.completed ? 'Undo' : 'Complete'}
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                disabled={isBusy}
                style={{
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 0.75rem'
                }}
              >
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
