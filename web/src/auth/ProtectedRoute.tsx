import type { ReactNode } from 'react';
import type { User } from './authApi';

interface ProtectedRouteProps { user: User | null; loading: boolean; onUnauthenticated: () => void; children: ReactNode }

export const ProtectedRoute = ({ user, loading, onUnauthenticated, children }: ProtectedRouteProps) => {
  if (loading) return <main aria-busy="true">Loading your session…</main>;
  if (!user) { onUnauthenticated(); return <main>Redirecting to login…</main>; }
  return <>{children}</>;
};
