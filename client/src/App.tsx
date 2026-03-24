import { useEffect, useMemo, useState } from 'react';
import type { Todo } from './types';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { createTodo, deleteTodo, fetchTodos, toggleTodo } from './api';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTodos()
      .then(setTodos)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load todos'))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (title: string) => {
    const newTodo = await createTodo(title);
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleToggle = async (id: string) => {
    setProcessing((prev) => new Set(prev).add(id));
    try {
      const updated = await toggleTodo(id);
      setTodos((prev) => prev.map((todo) => (todo.id === id ? updated : todo)));
    } finally {
      setProcessing((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDelete = async (id: string) => {
    setProcessing((prev) => new Set(prev).add(id));
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } finally {
      setProcessing((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos]
  );

  return (
    <div className="app-container">
      <h1>My To-Do List</h1>
      <p style={{ textAlign: 'center', color: '#475569', marginTop: '-0.5rem' }}>
        {completedCount} completed • {todos.length} total
      </p>

      <TodoForm onSubmit={handleAdd} />

      {error && (
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: '#64748b' }}>Loading…</p>
      ) : (
        <TodoList
          todos={todos}
          onToggle={handleToggle}
          onDelete={handleDelete}
          loadingIds={processing}
        />
      )}
    </div>
  );
}
