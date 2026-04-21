import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 * Props :
 *   requiredRole  'admin' | 'user' | undefined  → si undefined, juste être connecté suffit
 *   redirectTo    string                         → où rediriger si accès refusé (défaut: '/login')
 */
function ProtectedRoute({ children, requiredRole, redirectTo = '/login' }) {
  const { isLoggedIn, currentUser } = useAuth();

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  if (requiredRole && currentUser.role !== requiredRole) {
    // Un user qui essaie d'accéder à /admin → retour boutique
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

export default ProtectedRoute;
