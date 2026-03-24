import { FormEvent, useState } from 'react';

interface Props {
  onSubmit: (title: string) => Promise<void>;
}

export function TodoForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setError('Please enter a task title.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit(title.trim());
      setTitle('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <input
          type="text"
          placeholder="What do you need to do?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #cbd5f5'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.25rem',
            fontWeight: 600
          }}
        >
          {loading ? 'Adding…' : 'Add'}
        </button>
      </div>
      {error && (
        <p style={{ color: '#dc2626', marginTop: '0.5rem' }}>{error}</p>
      )}
    </form>
  );
}
