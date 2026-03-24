import type { Todo } from './types';

const BASE_URL = '/api/todos';

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to load todos');
  return res.json();
}

export async function createTodo(title: string): Promise<Todo> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  if (!res.ok) throw new Error('Failed to create todo');
  return res.json();
}

export async function toggleTodo(id: string): Promise<Todo> {
  const res = await fetch(`${BASE_URL}/${id}/toggle`, { method: 'PATCH' });
  if (!res.ok) throw new Error('Failed to toggle todo');
  return res.json();
}

export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete todo');
}
