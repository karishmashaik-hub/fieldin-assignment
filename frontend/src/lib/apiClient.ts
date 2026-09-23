const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const TOKEN_STORAGE_KEY = "fieldin-token";
const REFRESH_TOKEN_STORAGE_KEY = "fieldin-refresh-token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function setRefreshToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  }
}

export class ApiClientError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Auth endpoints never trigger a refresh-and-retry themselves — a 401 from
// /auth/login or /auth/register is a real credentials error, and a 401 from
// /auth/refresh means the refresh token itself is dead. Excluding all three
// is what keeps this from ever looping.
const NO_REFRESH_PATHS = ["/auth/login", "/auth/register", "/auth/refresh"];

// Concurrent requests that 401 at the same time share one in-flight refresh
// call instead of each firing their own — the second+ caller just awaits it.
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
        if (!response.ok) return false;
        const data = await response.json();
        setToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        return true;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

function clearSession(): void {
  setToken(null);
  setRefreshToken(null);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("fieldin:session-expired"));
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}, isRetry = false): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (response.status === 401 && !isRetry && !NO_REFRESH_PATHS.includes(path)) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiFetch<T>(path, options, true);
    }
    clearSession();
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await response.json() : undefined;

  if (!response.ok) {
    const message = body?.error ?? `Request failed with status ${response.status}`;
    throw new ApiClientError(response.status, message);
  }

  return body as T;
}
