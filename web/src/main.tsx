import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { currentUser, type User } from './auth/authApi';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { Header } from './components/Header';
import { LoginPage } from './pages/LoginPage';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const redirectForRole = (nextUser: User) => {
    const destination = nextUser.role === 'program_manager' ? '/manager' : '/participant';
    if (window.location.pathname !== destination) window.history.replaceState({}, '', destination);
    setUser(nextUser);
  };
  const signOut = () => {
    window.history.replaceState({}, '', '/login');
    setUser(null);
  };
  useEffect(() => { currentUser().then((nextUser) => { if (nextUser) redirectForRole(nextUser); }).finally(() => setLoading(false)); }, []);
  if (!loading && !user) return <LoginPage onSuccess={redirectForRole} />;
  return <ProtectedRoute user={user} loading={loading} onUnauthenticated={() => setUser(null)}>
    <Header user={user!} onLogout={signOut} />
    <main><h1>{user!.role === 'program_manager' ? 'Program Manager dashboard' : 'Study habits dashboard'}</h1><p>Authentication is ready. Activity goals and records will appear here in the next feature.</p></main>
  </ProtectedRoute>;
};

createRoot(document.getElementById('root')!).render(<App />);
