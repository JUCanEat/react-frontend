// "Search" bar above the 'filterbar'.
import { Input } from '~/shadcn/components/ui/input';
import { useTranslation } from 'react-i18next';
import { cn } from '~/shadcn/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchBar({ value, onChange, className }: SearchBarProps) {
  const { t } = useTranslation();

  return (
    <Input
      type="search"
      value={value}
      onChange={event => onChange(event.target.value)}
      placeholder={t('overview.search')}
      className={cn(
        'bg-white dark:bg-black text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400',
        className
      )}
    />
  );
}
