import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';
import type { Todo } from './types';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = express();
app.use(cors());
app.use(express.json());

let todos: Todo[] = [];

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/todos', (_req, res) => {
  res.json(todos.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
});

app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTodo: Todo = {
    id: nanoid(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };

  todos = [newTodo, ...todos];
  res.status(201).json(newTodo);
});

app.patch('/api/todos/:id/toggle', (req, res) => {
  const { id } = req.params;
  const todo = todos.find((item) => item.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todo.completed = !todo.completed;
  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const exists = todos.some((item) => item.id === id);
  if (!exists) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todos = todos.filter((item) => item.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
