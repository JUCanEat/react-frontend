interface StatusBannerProps {
  type: 'success' | 'error' | 'warning';
  message: string;
  showSpinner?: boolean;
}

export function StatusBanner({ type, message, showSpinner = false }: StatusBannerProps) {
  const styles = {
    success: {
      container: 'bg-sky-50 border-[#009DE0] dark:bg-sky-900/20 dark:border-sky-600',
      text: 'text-[#009DE0] dark:text-sky-300',
      spinner: 'border-[#009DE0] dark:border-sky-300',
    },
    error: {
      container: 'bg-red-50 border-red-400 dark:bg-red-900/20 dark:border-red-700',
      text: 'text-red-700 dark:text-red-300',
      spinner: 'border-red-600 dark:border-red-300',
    },
    warning: {
      container: 'bg-amber-50 border-amber-400 dark:bg-amber-900/20 dark:border-amber-700',
      text: 'text-amber-700 dark:text-amber-300',
      spinner: 'border-amber-600 dark:border-amber-300',
    },
  };

  const style = styles[type];

  return (
    <div className={`mb-6 p-4 rounded-lg border ${style.container}`}>
      <div className="flex items-center gap-3">
        {showSpinner && (
          <div
            className={`animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 ${style.spinner}`}
          />
        )}
        <p className={`font-medium ${style.text}`}>{message}</p>
      </div>
    </div>
  );
}
