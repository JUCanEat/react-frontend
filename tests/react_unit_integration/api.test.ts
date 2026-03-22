import { describe, it, expect, vi, afterEach } from 'vitest';
import { apiGet } from '~/api/api';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('apiGet', () => {
  it('resolves JSON on ok response', async () => {
    vi.stubGlobal(
      'fetch',
      async () =>
        ({
          ok: true,
          json: async () => ({ hello: 'world' }),
        }) as unknown as Response
    );

    await expect(apiGet<{ hello: string }>('/test')).resolves.toEqual({ hello: 'world' });
  });

  it('throws with status and body when response not ok', async () => {
    vi.stubGlobal(
      'fetch',
      async () =>
        ({
          ok: false,
          text: 'bad stuff',
          status: 500,
        }) as unknown as Response
    );

    await expect(apiGet('/fail')).rejects.toThrow('API Error: 500 - bad stuff');
  });
});
