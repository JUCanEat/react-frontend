// "Search" bar above the 'filterbar'.
import { Input } from '~/shadcn/components/ui/input';
import { useTranslation } from 'react-i18next';

export function SearchBar() {
  const { t } = useTranslation();

  return (
    <Input
      type="search"
      placeholder={t('overview.search')}
    />
  );
}
