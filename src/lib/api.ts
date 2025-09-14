const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://multi-tenant-backend-5w1o.vercel.app';

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `Login failed (${res.status})`);
  }

  return res.json();
}

export async function signup(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `Signup failed (${res.status})`);
  }

  return res.json();
}

export async function fetchNotes(token: string) {
  const res = await fetch(`${API_BASE}/api/notes`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `Failed to fetch notes (${res.status})`);
  }

  return res.json();
}

export async function createNote(token: string, title = "New Note") {
  const res = await fetch(`${API_BASE}/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title, content: "" }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `Failed to create note (${res.status})`);
  }

  return res.json();
}

export async function updateNote(token: string, id: string, title: string, content: string) {
  const res = await fetch(`${API_BASE}/api/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title, content }),
  });

  if (!res.ok) throw new Error("Failed to update note");
  return res.json();
}

export async function deleteNote(token: string, id: string) {
  const res = await fetch(`${API_BASE}/api/notes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to delete note");
  return res.json();
}

export async function upgradeTenant(token: string, slug: string) {
  const res = await fetch(`${API_BASE}/api/tenants/${slug}/upgrade`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to upgrade tenant");
  return res.json();
}
