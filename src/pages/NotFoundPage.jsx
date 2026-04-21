import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NotFoundPage() {
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();

  const home = isLoggedIn ? (isAdmin ? '/admin' : '/shop') : '/login';

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <p className="not-found-eyebrow">Erreur 404</p>
        <h1 className="not-found-title">Page introuvable</h1>
        <p className="not-found-desc">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <button className="btn-checkout" style={{ maxWidth: 240, margin: '0 auto' }} onClick={() => navigate(home)}>
          ← Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;
