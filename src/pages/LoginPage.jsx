import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login, isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ username: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  // Si déjà connecté, rediriger directement
  useEffect(() => {
    if (isLoggedIn) {
      navigate(isAdmin ? '/admin' : '/shop', { replace: true });
    }
  }, [isLoggedIn, isAdmin, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 350));
    const result = login(form.username.trim(), form.password);
    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    navigate(result.role === 'admin' ? '/admin' : '/shop', { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-logo">◈</span>
          <h1>KICKS</h1>
          <p>Connectez-vous pour accéder à la boutique</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field">
            <label htmlFor="username">Identifiant</label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="admin ou user"
              autoComplete="username"
              autoFocus
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="login-error">⚠ {error}</p>}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="login-hints">
          <p><strong>Admin :</strong> admin / admin123</p>
          <p><strong>User :</strong> user / user123</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
