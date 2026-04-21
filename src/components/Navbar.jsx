import { NavLink, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { cartCount, state } = useShop();
  const { isLoggedIn, isAdmin, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn || isAdmin) return null;

  const favCount = state.favorites.length;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="navbar">
      <NavLink to="/shop" className="navbar-brand">◈ KICKS</NavLink>

      <nav className="navbar-links">
        <NavLink to="/shop" end>Accueil</NavLink>
        <NavLink to="/men-and-mixte">Homme</NavLink>
        <NavLink to="/women-and-mixte">Femmes</NavLink>
      </nav>

      <div className="navbar-actions">
        {/* Favoris */}
        <NavLink to="/favorites" className="nav-icon-link" aria-label="Favoris">
          ❤️ {favCount > 0 && <span className="cart-badge">{favCount}</span>}
        </NavLink>

        {/* Panier */}
        <NavLink to="/cart" className="nav-icon-link" aria-label="Panier">
          🛒 {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </NavLink>

        <div className="nav-user">
          <span className="nav-username">{currentUser.displayName}</span>
          <button className="btn-nav-logout" onClick={handleLogout}>Déconnexion</button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
