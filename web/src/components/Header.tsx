import type { User } from '../auth/authApi';
import { logout } from '../auth/authApi';

export const Header = ({ user, onLogout }: { user: User; onLogout: () => void }) => {
  const signOut = async () => { await logout(); onLogout(); };
  return <header><span>Signed in as {user.email} ({user.role})</span><button type="button" onClick={signOut}>Logout</button></header>;
};
