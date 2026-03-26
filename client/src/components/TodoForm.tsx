import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

interface Props {
  onAdd: (title: string) => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '0.75rem 1.25rem',
        fontWeight: 600,
      }}
    >
      {pending ? 'Adding…' : 'Add'}
    </button>
  );
}

export function TodoForm({ onAdd }: Props) {
  const [error, formAction] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      const title = (formData.get('title') as string)?.trim();
      if (!title) return 'Please enter a task title.';
      try {
        onAdd(title);
        return null;
      } catch (err) {
        return err instanceof Error ? err.message : 'Unknown error';
      }
    },
    null
  );

  return (
    <form action={formAction} style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <input
          type="text"
          name="title"
          placeholder="What do you need to do?"
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #cbd5f5',
          }}
        />
        <SubmitButton />
      </div>
      {error && (
        <p style={{ color: '#dc2626', marginTop: '0.5rem' }}>{error}</p>
      )}
    </form>
  );
}
