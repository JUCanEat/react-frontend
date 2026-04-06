import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ErrorStateProps {
  message: string;
  backPath?: string;
  backLabel?: string;
}

export function ErrorState({ message, backPath = '/profile', backLabel }: ErrorStateProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen p-4 bg-transparent dark:bg-zinc-950">
      <div className="max-w-md w-full p-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700">
        <p className="text-center font-medium text-red-700 dark:text-red-300">{message}</p>
        <button
          onClick={() => navigate(backPath)}
          className="w-full mt-4 px-4 py-2 rounded text-white font-medium bg-[#1B1B1B] dark:bg-zinc-800 hover:opacity-90 transition-opacity"
        >
          {backLabel ?? t('staff.backToProfile')}
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

export function EmptyState({ message, backPath = '/profile', backLabel }: EmptyStateProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen p-4 bg-transparent dark:bg-zinc-950">
      <p className="text-center mb-4 text-gray-900 dark:text-gray-200">{message}</p>
      <button
        onClick={() => navigate(backPath)}
        className="px-4 py-2 rounded text-white font-medium bg-[#1B1B1B] dark:bg-zinc-800 hover:opacity-90 transition-opacity"
      >
        {backLabel ?? t('staff.backToProfile')}
      </button>
    </div>
  );
}
