import { createContext, useContext, useState, useEffect } from 'react';

// Comptes simulés codés en dur
const ACCOUNTS = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', displayName: 'Administrateur' },
  { id: 2, username: 'user',  password: 'user123',  role: 'user',  displayName: 'Client' },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('currentUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const login = (username, password) => {
    const account = ACCOUNTS.find(
      (a) => a.username === username && a.password === password
    );
    if (!account) return { success: false, error: 'Identifiants incorrects' };
    const { password: _, ...safeUser } = account;
    setCurrentUser(safeUser);
    return { success: true, role: safeUser.role };
  };

  const logout = () => setCurrentUser(null);

  const isAdmin = currentUser?.role === 'admin';
  const isLoggedIn = !!currentUser;

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAdmin, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return ctx;
}
