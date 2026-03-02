import {
  useQuery,
  type UseQueryResult,
  useMutation,
  type UseMutationResult,
} from '@tanstack/react-query';

export function apiGet<T>(key: string, url: string): UseQueryResult<T> {
  return useQuery<T>({
    queryKey: [key],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API Error: ${response.status} - ${text}`);
      }
      return response.json() as Promise<T>;
    },
  });
}

export function apiPut<TInput>(key: string, url: string, body: TInput) {
  return useQuery({
    queryKey: [key, body],
    queryFn: async () => {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API Error: ${response.status} - ${text}`);
      }

      return response;
    },
  });
}

export function useApiMutation<TInput, TOutput = any>(
  url: string,
  method: 'PUT' | 'POST' | 'DELETE' = 'PUT'
) {
  return useMutation<TOutput, Error, TInput>({
    mutationFn: async (data: TInput) => {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API Error: ${response.status} - ${text}`);
      }

      return response.json() as Promise<TOutput>;
    },
  });
}

export function useApiPut<TInput, TOutput = any>(url: string) {
  return useMutation<TOutput, Error, TInput>({
    mutationFn: async (data: TInput) => {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API Error: ${response.status} - ${text}`);
      }

      return response.json() as Promise<TOutput>;
    },
  });
}

export function useApiPost<TInput, TOutput = any>(url: string) {
  return useMutation<TOutput, Error, TInput>({
    mutationFn: async (data: TInput) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API Error: ${response.status} - ${text}`);
      }

      return response.json() as Promise<TOutput>;
    },
  });
}
