import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
  message: string;
  backPath?: string;
  backLabel?: string;
}

export function ErrorState({
  message,
  backPath = '/profile',
  backLabel = 'Back to Profile',
}: ErrorStateProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen p-4">
      <div
        className="max-w-md w-full p-6 rounded-lg"
        style={{ backgroundColor: '#FFE5E5', border: '1px solid #FF6B6B' }}
      >
        <p
          className="text-center font-medium"
          style={{ color: '#D32F2F' }}
        >
          {message}
        </p>
        <button
          onClick={() => navigate(backPath)}
          className="w-full mt-4 px-4 py-2 rounded text-white font-medium"
          style={{ backgroundColor: '#1B1B1B' }}
        >
          {backLabel}
        </button>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  message: string;
  backPath?: string;
  backLabel?: string;
}

export function EmptyState({
  message,
  backPath = '/profile',
  backLabel = 'Back to Profile',
}: EmptyStateProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen p-4">
      <p
        className="text-center mb-4"
        style={{ color: '#1B1B1B' }}
      >
        {message}
      </p>
      <button
        onClick={() => navigate(backPath)}
        className="px-4 py-2 rounded text-white font-medium"
        style={{ backgroundColor: '#1B1B1B' }}
      >
        {backLabel}
      </button>
    </div>
  );
}
