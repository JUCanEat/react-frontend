export async function apiGet<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (response.ok) {
        return response.json() as Promise<T>;
    }

    const text = await response.text;
    const status = response.status;
    throw new Error(`API Error: ${status} - ${text}`);
}