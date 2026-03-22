// Ensure DOM globals for libraries that expect them
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><html><body></body></html>');
// @ts-ignore
global.window = dom.window as any;
// @ts-ignore
global.document = dom.window.document as any;
// @ts-ignore
Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true });

import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetAllRestaurants } from '~/api/restaurant_service';
import { useGetAllVendingMachines } from '~/api/vending_machine_service';

afterEach(() => vi.restoreAllMocks());

describe('API service hooks', () => {
  it('useGetAllRestaurants fetches restaurants', async () => {
    const mocked = [
      {
        id: 'r1',
        name: 'R1',
        description: 'd',
        photoPath: '',
        location: { id: 'l1', latitude: { value: 0 }, longitude: { value: 0 } },
        openNow: true,
      },
    ];
    vi.stubGlobal('fetch', async () => ({ ok: true, json: async () => mocked }) as Response);

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useGetAllRestaurants(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mocked);
  });

  it('useGetAllVendingMachines fetches vending machines', async () => {
    const mocked = [
      {
        id: 'v1',
        description: 'vm',
        photoPath: '',
        location: { id: 'l1', latitude: { value: 0 }, longitude: { value: 0 } },
      },
    ];
    vi.stubGlobal('fetch', async () => ({ ok: true, json: async () => mocked }) as Response);

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useGetAllVendingMachines(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mocked);
  });
});
