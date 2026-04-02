import type { ApiResponse } from "@/types";

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

async function request<T>(url: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
  try {
    const { body, headers, ...rest } = options;

    const res = await fetch(url, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    });

    if (!res.ok) {
      const text = await res.text();
      let message = `Erreur ${res.status}`;
      try {
        const json = JSON.parse(text);
        message = json.error ?? json.message ?? message;
      } catch {}
      return { data: null, error: message };
    }

    // Reponse vide (204 No Content)
    if (res.status === 204) return { data: null as T, error: null };

    const data = await res.json();
    return { data, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur reseau";
    return { data: null, error: message };
  }
}

export const api = {
  get: <T>(url: string, options?: FetchOptions) => request<T>(url, { ...options, method: "GET" }),

  post: <T>(url: string, body?: unknown, options?: FetchOptions) =>
    request<T>(url, { ...options, method: "POST", body }),

  put: <T>(url: string, body?: unknown, options?: FetchOptions) =>
    request<T>(url, { ...options, method: "PUT", body }),

  patch: <T>(url: string, body?: unknown, options?: FetchOptions) =>
    request<T>(url, { ...options, method: "PATCH", body }),

  delete: <T>(url: string, options?: FetchOptions) =>
    request<T>(url, { ...options, method: "DELETE" }),
};
