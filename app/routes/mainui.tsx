import type { Route } from './+types/mainui';
import { Outlet } from 'react-router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'JU Can Eat' },
    { name: 'description', content: 'Welcome to JU Can Eat/ObiadUJ!' },
  ];
}

export default function MainUI() {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
