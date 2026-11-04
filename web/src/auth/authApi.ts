export interface User {
  id: string;
  email: string;
  role: 'program_manager' | 'participant';
}

const parseResponse = async (response: Response): Promise<{ user?: User; error?: { message: string } }> => {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error?.message || 'The request failed.');
  return body;
};

export const login = async (email: string, password: string): Promise<User> => {
  const body = await parseResponse(await fetch('/api/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
    body: JSON.stringify({ email, password }),
  }));
  return body.user!;
};

export const currentUser = async (): Promise<User | null> => {
  const response = await fetch('/api/auth/me', { credentials: 'include' });
  if (response.status === 401) return null;
  const body = await parseResponse(response);
  return body.user ?? null;
};

export const logout = async (): Promise<void> => {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
};
