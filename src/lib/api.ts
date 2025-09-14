// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://multi-tenant-backend-5w1o.vercel.app';

// -------------------- TYPES --------------------
export interface AuthResponse {
  token: string;
  user: { id: string; email: string };
}

export interface Note {
  id: string;
  title: string;
  content: Record<string, unknown>; // Tiptap JSON
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  slug: string;
  plan: string;
  upgraded_at?: string;
}

// -------------------- HELPER --------------------
async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, options);

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

// -------------------- AUTH --------------------
export function login(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export function signup(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

// -------------------- NOTES --------------------
export function fetchNotes(token: string): Promise<Note[]> {
  return apiFetch<Note[]>('/api/notes', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function createNote(token: string, title = 'New Note'): Promise<Note> {
  return apiFetch<Note>('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title, content: { type: 'doc', content: [] } }),
  });
}

export function updateNote(
  token: string,
  id: string,
  title: string,
  content: Record<string, unknown>
): Promise<Note> {
  return apiFetch<Note>(`/api/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title, content }),
  });
}

export function deleteNote(token: string, id: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

// -------------------- TENANTS --------------------
export function upgradeTenant(token: string, slug: string): Promise<Tenant> {
  return apiFetch<Tenant>(`/api/tenants/${slug}/upgrade`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}
