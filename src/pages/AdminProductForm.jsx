import { useState } from 'react';

const EMPTY = {
  name: '', brand: '', category: 'h', price: '', stock: '',
  content: '', online: true,
  size: [],
  picture: [{ pic1: '', pic2: '', pic3: '' }],
};

const SIZE_OPTIONS = ['EU 35','EU 36','EU 37','EU 38','EU 39','EU 40','EU 41','EU 42','EU 43','EU 44'];

function AdminProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState(product ? { ...product } : EMPTY);

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const toggleSize = (size) => {
    const sizes = form.size || [];
    set('size', sizes.includes(size) ? sizes.filter((s) => s !== size) : [...sizes, size]);
  };

  const setPic = (key, value) => {
    setForm((prev) => ({
      ...prev,
      picture: [{ ...prev.picture[0], [key]: value }],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
    });
  };

  return (
    <div className="admin-form-overlay">
      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{product ? 'Modifier l\'article' : 'Nouvel article'}</h3>

        <div className="form-grid">
          <div className="field">
            <label>Nom *</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} required />
          </div>
          <div className="field">
            <label>Marque *</label>
            <input value={form.brand} onChange={(e) => set('brand', e.target.value)} required />
          </div>
          <div className="field">
            <label>Prix (€) *</label>
            <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} required />
          </div>
          <div className="field">
            <label>Stock *</label>
            <input type="number" min="0" value={form.stock} onChange={(e) => set('stock', e.target.value)} required />
          </div>
          <div className="field">
            <label>Catégorie</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)}>
              <option value="h">Homme</option>
              <option value="f">Femme</option>
              <option value="mixte">Mixte</option>
            </select>
          </div>
          <div className="field">
            <label>En ligne</label>
            <select value={form.online} onChange={(e) => set('online', e.target.value === 'true')}>
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>
        </div>

        <div className="field full">
          <label>Description</label>
          <textarea rows={3} value={form.content} onChange={(e) => set('content', e.target.value)} />
        </div>

        <div className="field full">
          <label>Tailles disponibles</label>
          <div className="size-picker">
            {SIZE_OPTIONS.map((s) => (
              <button
                type="button"
                key={s}
                className={`size-btn ${(form.size || []).includes(s) ? 'selected' : ''}`}
                onClick={() => toggleSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="form-grid">
          {['pic1', 'pic2', 'pic3'].map((key) => (
            <div className="field" key={key}>
              <label>Image {key}</label>
              <input
                placeholder="https://..."
                value={form.picture[0][key] || ''}
                onChange={(e) => setPic(key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>Annuler</button>
          <button type="submit" className="btn-primary">
            {product ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminProductForm;
