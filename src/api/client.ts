import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "./config";

const TOKEN_KEY = "hrms.auth.token";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setAuthToken(token: string | null): Promise<void> {
  if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
  else await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = true, ...init } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };

  if (auth) {
    const token = await getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const text = await res.text();
  let body: { error?: string } | T = {};
  if (text) {
    try {
      body = JSON.parse(text) as { error?: string } | T;
    } catch {
      throw new ApiError("Invalid server response", res.status);
    }
  }

  if (!res.ok) {
    const msg =
      typeof body === "object" && body && "error" in body && body.error
        ? String(body.error)
        : `Request failed (${res.status})`;
    throw new ApiError(msg, res.status);
  }

  return body as T;
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}
