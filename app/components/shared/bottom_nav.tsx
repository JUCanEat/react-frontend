import { ItemActions } from '~/shadcn/components/ui/item';
import { Button } from '~/shadcn/components/ui/button';
import { Home, Map, User } from 'lucide-react';

export function BottomNav({ page }: { page: string }) {
  return (
    <div className="flex w-full justify-center">
      <nav className="flex items-center gap-8 p-3 mb-10 rounded-xl dark:bg-zinc-900">
        <Button
          variant={page === 'overview' ? 'highlight' : 'ghost'}
          border="none"
          onClick={() => (window.location.href = '/')}
        >
          <Home className="" />
        </Button>
        <Button
          variant={page === 'map' ? 'highlight' : 'ghost'}
          border="none"
          onClick={() => (window.location.href = '/map')}
        >
          <Map className="" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => (window.location.href = '/profile')}
        >
          <User className="" />
        </Button>
      </nav>
    </div>
  );
}
