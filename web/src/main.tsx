import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { currentUser, type User } from './auth/authApi';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { Header } from './components/Header';
import { LoginPage } from './pages/LoginPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { GoalsPage } from './pages/GoalsPage';
import { NewGoalPage } from './pages/NewGoalPage';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [goalRefresh, setGoalRefresh] = useState(0);
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
  if (loading) return <main aria-busy="true">Loading your session…</main>;
  if (!user) return <LoginPage onSuccess={redirectForRole} />;
  return <ProtectedRoute user={user} loading={loading} onUnauthenticated={() => setUser(null)}>
    <Header user={user!} onLogout={signOut} />
    <TemplatesPage user={user!} />
    {user!.role === 'participant' && <><NewGoalPage onCreated={() => setGoalRefresh((value) => value + 1)} /><GoalsPage refreshKey={goalRefresh} /></>}
  </ProtectedRoute>;
};

createRoot(document.getElementById('root')!).render(<App />);
