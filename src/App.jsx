import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';

import Navbar         from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage      from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import FavoritesPage  from './pages/FavoritesPage';
import CartPage       from './pages/CartPage';
import CheckoutPage   from './pages/CheckoutPage';

import Home         from './components/Home';
import CategoryPage from './components/CategoryPage';
import Details      from './components/Details';

import './App.css';

const Guard = ({ children }) => <ProtectedRoute redirectTo="/login">{children}</ProtectedRoute>;

function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />

            <Route path="/admin" element={<ProtectedRoute requiredRole="admin" redirectTo="/login"><AdminDashboard /></ProtectedRoute>} />

            <Route path="/shop"           element={<Guard><Home /></Guard>} />
            <Route path="/men-and-mixte"  element={<Guard><CategoryPage categories={['h', 'mixte']} title="Homme" /></Guard>} />
            <Route path="/women-and-mixte" element={<Guard><CategoryPage categories={['f', 'mixte']} title="Femmes" /></Guard>} />
            <Route path="/details/:id"    element={<Guard><Details /></Guard>} />
            <Route path="/favorites"      element={<Guard><FavoritesPage /></Guard>} />
            <Route path="/cart"           element={<Guard><CartPage /></Guard>} />
            <Route path="/checkout"       element={<Guard><CheckoutPage /></Guard>} />

            <Route path="*" element={<div className="not-found"><h2>404</h2><p>Cette page n'existe pas.</p><a href="/login">← Retour</a></div>} />
          </Routes>
        </Router>
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;
