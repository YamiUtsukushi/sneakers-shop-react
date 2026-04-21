import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminProductForm from './AdminProductForm';
import initialData from '../service/data.json';

// Commandes simulées pour la démo
const FAKE_ORDERS = [
  { id: 'CMD-001', user: 'jean.dupont@mail.com', total: 329.98, status: 'Livré',    date: '2024-03-10', items: ['Air Force 1 \'07', 'Nike Blazer Mid \'77'] },
  { id: 'CMD-002', user: 'marie.martin@mail.com', total: 199.99, status: 'En cours', date: '2024-03-14', items: ['Nike Air Max Plus'] },
  { id: 'CMD-003', user: 'paul.roger@mail.com',   total: 582.00, status: 'En attente', date: '2024-03-15', items: ['Nike Aire Max 1'] },
  { id: 'CMD-004', user: 'sara.benali@mail.com',  total: 119.00, status: 'Livré',    date: '2024-03-16', items: ['Run Star Motion CX'] },
];

const STATUS_COLOR = {
  'Livré':      '#22c55e',
  'En cours':   '#f59e0b',
  'En attente': '#6366f1',
  'Annulé':     '#ef4444',
};

function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('catalogue');
  const [products, setProducts]   = useState(initialData);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm]   = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  // ── Suppression ──────────────────────────────────────────────────────────────
  const handleDelete = (id) => {
    if (!window.confirm('Supprimer cet article ?')) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // ── Sauvegarde (ajout ou modif) ───────────────────────────────────────────────
  const handleSave = (product) => {
    if (product.id) {
      setProducts((prev) => prev.map((p) => p.id === product.id ? product : p));
    } else {
      const newId = Math.max(...products.map((p) => p.id)) + 1;
      setProducts((prev) => [...prev, { ...product, id: newId }]);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  // ── Stock update ──────────────────────────────────────────────────────────────
  const handleStockChange = (id, delta) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
      )
    );
  };

  // ── Stats rapides ─────────────────────────────────────────────────────────────
  const totalProducts  = products.length;
  const outOfStock     = products.filter((p) => p.stock === 0).length;
  const totalRevenue   = FAKE_ORDERS.reduce((s, o) => s + o.total, 0);
  const pendingOrders  = FAKE_ORDERS.filter((o) => o.status === 'En attente').length;

  const navItems = [
    { key: 'catalogue', label: '📦 Catalogue',  },
    { key: 'stocks',    label: '📊 Stocks',      },
    { key: 'orders',    label: '🧾 Commandes',   },
  ];

  return (
    <div className="admin-layout">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span>◈</span> KICKS Admin
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`admin-nav-item ${activeSection === item.key ? 'active' : ''}`}
              onClick={() => { setActiveSection(item.key); setShowForm(false); }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <p className="admin-user-name">{currentUser.displayName}</p>
          <button className="btn-logout" onClick={handleLogout}>Déconnexion</button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="admin-main">

        {/* KPI cards */}
        <div className="admin-kpis">
          <div className="kpi-card"><span className="kpi-value">{totalProducts}</span><span className="kpi-label">Articles</span></div>
          <div className="kpi-card warn"><span className="kpi-value">{outOfStock}</span><span className="kpi-label">Ruptures</span></div>
          <div className="kpi-card"><span className="kpi-value">{totalRevenue.toFixed(0)} €</span><span className="kpi-label">CA simulé</span></div>
          <div className="kpi-card"><span className="kpi-value">{pendingOrders}</span><span className="kpi-label">En attente</span></div>
        </div>

        {/* ── CATALOGUE ── */}
        {activeSection === 'catalogue' && (
          <section className="admin-section">
            <div className="admin-section-header">
              <h2>Catalogue</h2>
              <button className="btn-primary" onClick={() => { setEditingProduct(null); setShowForm(true); }}>
                + Ajouter un article
              </button>
            </div>

            {showForm && (
              <AdminProductForm
                product={editingProduct}
                onSave={handleSave}
                onCancel={() => { setShowForm(false); setEditingProduct(null); }}
              />
            )}

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Photo</th><th>Nom</th><th>Marque</th>
                    <th>Prix</th><th>Stock</th><th>Catégorie</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td><img src={p.picture[0].pic1} alt={p.name} className="admin-thumb" /></td>
                      <td className="td-name">{p.name}</td>
                      <td>{p.brand}</td>
                      <td>{p.price.toFixed(2)} €</td>
                      <td>
                        <span className={p.stock === 0 ? 'badge-out' : 'badge-in'}>
                          {p.stock}
                        </span>
                      </td>
                      <td><span className="badge-cat">{p.category}</span></td>
                      <td className="td-actions">
                        <button className="btn-edit" onClick={() => { setEditingProduct(p); setShowForm(true); }}>✏️</button>
                        <button className="btn-del"  onClick={() => handleDelete(p.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── STOCKS ── */}
        {activeSection === 'stocks' && (
          <section className="admin-section">
            <div className="admin-section-header"><h2>Gestion des stocks</h2></div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr><th>Article</th><th>Stock actuel</th><th>Statut</th><th>Ajuster</th></tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="td-name">{p.name}</td>
                      <td><strong>{p.stock}</strong></td>
                      <td>
                        <span className={p.stock === 0 ? 'badge-out' : p.stock < 5 ? 'badge-low' : 'badge-in'}>
                          {p.stock === 0 ? 'Rupture' : p.stock < 5 ? 'Stock faible' : 'Disponible'}
                        </span>
                      </td>
                      <td className="stock-controls">
                        <button onClick={() => handleStockChange(p.id, -1)}>−</button>
                        <span>{p.stock}</span>
                        <button onClick={() => handleStockChange(p.id, +1)}>+</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── COMMANDES ── */}
        {activeSection === 'orders' && (
          <section className="admin-section">
            <div className="admin-section-header"><h2>Commandes</h2></div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr><th>N°</th><th>Client</th><th>Articles</th><th>Total</th><th>Date</th><th>Statut</th></tr>
                </thead>
                <tbody>
                  {FAKE_ORDERS.map((o) => (
                    <tr key={o.id}>
                      <td><code>{o.id}</code></td>
                      <td>{o.user}</td>
                      <td className="td-items">{o.items.join(', ')}</td>
                      <td><strong>{o.total.toFixed(2)} €</strong></td>
                      <td>{o.date}</td>
                      <td>
                        <span className="badge-status" style={{ background: STATUS_COLOR[o.status] + '22', color: STATUS_COLOR[o.status] }}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
