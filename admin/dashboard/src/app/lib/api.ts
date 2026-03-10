export const API_BASE    = import.meta.env.VITE_API_BASE as string;
export const STORAGE_URL = (import.meta.env.VITE_STORAGE_URL as string)
  || `${API_BASE.replace('/api/v1', '')}/storage`;

/**
 * Convert a stored path ("uploads/file.jpg") to a displayable URL.
 * Also handles legacy DB records that already contain a full http URL.
 */
export function storage(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;   // legacy full URL — use as-is
  return `${STORAGE_URL}/${path}`;            // clean path → full URL
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export async function logout(): Promise<void> {
  try { await apiJson("/auth/logout", "POST"); } catch {}
  clearToken();
}
export function getToken(): string | null {
  return localStorage.getItem("token");
}
export function setToken(token: string) {
  localStorage.setItem("token", token);
}
export function clearToken() {
  localStorage.removeItem("token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseError(res: Response): Promise<string> {
  try {
    const text = await res.text();
    const data = JSON.parse(text);
    return data?.message || JSON.stringify(data);
  } catch {
    return "Request failed";
  }
}

export async function apiJson<T>(
  path: string,
  method: HttpMethod = "GET",
  body?: unknown
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...authHeaders(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as T;
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(await parseError(res));
}

export async function uploadSingleImage(
  file: File
): Promise<{ url: string; path: string }> {
  const fd = new FormData();
  fd.append("image", file);

  const res = await fetch(`${API_BASE}/uploads/image`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: fd,
  });

  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as { url: string; path: string };
}

export async function uploadMultipleImages(
  files: File[]
): Promise<Array<{ url: string; path: string }>> {
  const fd = new FormData();
  files.forEach((f) => fd.append("images[]", f));

  const res = await fetch(`${API_BASE}/uploads/images`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: fd,
  });

  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { files: Array<{ url: string; path: string }> };
  return data.files;
}

export async function login(email: string, password: string): Promise<void> {
  const data = await apiJson<{ token: string }>("/auth/login", "POST", { email, password });
  setToken(data.token);
}
