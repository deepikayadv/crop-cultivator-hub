import { readSession, writeSession } from "@/lib/auth-storage";

/**
 * REST client for the external Node.js/Express + MySQL API.
 * Only the public base URL lives here — DB passwords and JWT secrets stay on the server.
 */
const RAW_BASE = (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "";
export const API_BASE_URL = RAW_BASE.replace(/\/+$/, "");
export const isApiConfigured = API_BASE_URL.length > 0;

export class ApiError extends Error {
  status: number;
  details: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function apiRequest<T>(
  path: string,
  opts: { method?: Method; body?: unknown; signal?: AbortSignal } = {},
): Promise<T> {
  if (!isApiConfigured) throw new ApiError("API base URL is not configured", 0);

  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  const token = readSession()?.token;
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method: opts.method ?? "GET",
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : null,
      signal: opts.signal ?? null,
    });
  } catch (err) {
    throw new ApiError("Could not reach the server. Check your internet connection.", 0, err);
  }

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    if (res.status === 401) writeSession(null);
    const message =
      data && typeof data === "object" && "message" in data && typeof data.message === "string"
        ? data.message
        : `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data);
  }
  return data as T;
}

/** Simulated latency for demo mode so loading states are visible. */
export function mockDelay(ms = 350) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
