import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import type { Route } from './+types/root';
import './tailwind_styles.css';
import './i18n';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ReactKeycloakProvider } from '@react-keycloak/web';
import { getKeycloak } from '~/auth/keycloak';

export const rootQueryUrl = import.meta.env.VITE_BACKEND_URL;
export const allRestaurantsEndpoint: string = 'api/restaurants';
export const allVendingMachinesEndpoint: string = 'api/vending-machines';
export const menusEndpoint = 'api/menus';
export const menuEndpoint = 'api/menus/:id';

export const createMenuEndpoint: string = 'api/menus/';

export const links: Route.LinksFunction = () => [
  { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export const meta: Route.MetaFunction = () => [
  { title: 'JU Can Eat' },
  { name: 'description', content: 'Welcome to JU Can Eat/ObiadUJ!' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <Links />
      </head>
      <body className="bg-gradient-to-b from-sky-50 via-white to-white dark:bg-gradient-to-b dark:from-zinc-800 dark:via-zinc-950 dark:to-black">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const queryClient = new QueryClient();

export default function App() {
  const { i18n } = useTranslation();
  const keycloak = getKeycloak();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = i18n.language;
    }
  }, [i18n.language]);

  if (!keycloak) {
    return null;
  }

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: 'check-sso',
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </ReactKeycloakProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useTranslation();

  let message = t('errors.oops');
  let details = t('errors.unexpected');
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : t('common.error');
    details = error.status === 404 ? t('errors.notFound') : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
