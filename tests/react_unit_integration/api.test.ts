import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { apiGet } from '~/api/api';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('apiGet', () => {
  it('resolves JSON on ok response', async () => {
    const mockData = { hello: 'world' };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockData),
      })
    );

    const { result } = renderHook(() => apiGet<{ hello: string }>('test-key', '/test'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(fetch).toHaveBeenCalledWith('/test');
  });

  it('handles error response correctly', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: vi.fn().mockResolvedValue('Internal Server Error'),
      })
    );

    const { result } = renderHook(() => apiGet('test-key', '/fail'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('API Error: 500 - Internal Server Error');
    expect(result.current.data).toBeUndefined();
  });

  it('handles network error correctly', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    const { result } = renderHook(() => apiGet('test-key', '/network-fail'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Network error');
  });

  it('shows loading state initially', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => new Promise(() => {}))
    );

    const { result } = renderHook(() => apiGet('test-key', '/loading'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it('caches data correctly with query key', async () => {
    const mockData = { cached: 'data' };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    vi.stubGlobal('fetch', fetchMock);

    const wrapper = createWrapper();

    const { result: result1 } = renderHook(
      () => apiGet<{ cached: string }>('cache-key', '/cached'),
      {
        wrapper,
      }
    );

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true);
    });

    const { result: result2 } = renderHook(
      () => apiGet<{ cached: string }>('cache-key', '/cached'),
      {
        wrapper,
      }
    );

    expect(result2.current.data).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
