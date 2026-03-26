import { useEffect, useMemo, useOptimistic, useState, useTransition } from 'react';
import type { Todo } from './types';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { createTodo, deleteTodo, fetchTodos, toggleTodo } from './api';

type OptimisticAction =
  | { type: 'add'; todo: Todo }
  | { type: 'toggle'; id: string }
  | { type: 'delete'; id: string };

function todosReducer(state: Todo[], action: OptimisticAction): Todo[] {
  switch (action.type) {
    case 'add':
      return [action.todo, ...state];
    case 'delete':
      return state.filter((t) => t.id !== action.id);
    case 'toggle':
      return state.map((t) => (t.id === action.id ? { ...t, completed: !t.completed } : t));
  }
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [optimisticTodos, updateOptimisticTodos] = useOptimistic(todos, todosReducer);

  useEffect(() => {
    fetchTodos()
      .then(setTodos)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load todos'))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (title: string) => {
    const tempTodo: Todo = {
      id: `temp-${Date.now()}`,
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    startTransition(async () => {
      updateOptimisticTodos({ type: 'add', todo: tempTodo });
      const newTodo = await createTodo(title);
      setTodos((prev) => [newTodo, ...prev]);
    });
  };

  const handleToggle = (id: string) => {
    startTransition(async () => {
      updateOptimisticTodos({ type: 'toggle', id });
      const updated = await toggleTodo(id);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      updateOptimisticTodos({ type: 'delete', id });
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    });
  };

  const completedCount = useMemo(
    () => optimisticTodos.filter((t) => t.completed).length,
    [optimisticTodos]
  );

  return (
    <div className="app-container">
      <h1>My To-Do List</h1>
      <p style={{ textAlign: 'center', color: '#475569', marginTop: '-0.5rem' }}>
        {completedCount} completed • {optimisticTodos.length} total
      </p>

      <TodoForm onAdd={handleAdd} />

      {error && (
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: '#64748b' }}>Loading…</p>
      ) : (
        <TodoList
          todos={optimisticTodos}
          onToggle={handleToggle}
          onDelete={handleDelete}
          isPending={isPending}
        />
      )}
    </div>
  );
}
