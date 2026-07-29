const BASE_URL = import.meta.env.VITE_API_URL || "https://api.dev.anarix.ai/api";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options?: RequestInit & { extraHeaders?: Record<string, string> }): Promise<T> {
  const token = localStorage.getItem("anarix_auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.extraHeaders || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string>) },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new ApiError(res.status, text || res.statusText);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(path: string, extraHeaders?: Record<string, string>) =>
    request<T>(path, { method: "GET", extraHeaders }),
  post: <T>(path: string, body?: unknown, extraHeaders?: Record<string, string>) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined, extraHeaders }),
  put: <T>(path: string, body?: unknown, extraHeaders?: Record<string, string>) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined, extraHeaders }),
  delete: <T>(path: string, extraHeaders?: Record<string, string>) =>
    request<T>(path, { method: "DELETE", extraHeaders }),
};
