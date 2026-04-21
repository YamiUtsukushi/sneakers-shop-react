import { useState } from 'react';
import data from '../service/data.json';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch, isFavorite } = useShop();
  const { isAdmin } = useAuth();

  const item = data.find((article) => article.id === Number(id));
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError]       = useState(false);
  const [added, setAdded]               = useState(false);

  if (!item) {
    return (
      <div className="page-content">
        <h2>Article introuvable</h2>
        <button onClick={() => navigate(-1)}>← Retour</button>
      </div>
    );
  }

  const available = item.online && item.stock > 0;
  const fav = isFavorite(item.id);
  const pictures = Object.values(item.picture[0]).filter(Boolean);

  const [mainImg, setMainImg] = useState(pictures[0]);

  const handleFavorite = () => dispatch({ type: 'FAVORITES_TOGGLE', id: item.id });

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return; }
    dispatch({ type: 'CART_ADD', item: { ...item, selectedSize } });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const renderStars = (stars) => {
    const full = Math.floor(stars);
    const half = stars % 1 >= 0.5;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
  };

  return (
    <div className="details-page">
      <button className="back-link" onClick={() => navigate(-1)}>← Retour</button>

      <div className="details-layout">
        {/* ── Galerie ── */}
        <div className="details-gallery">
          <img className="details-main-img" src={mainImg} alt={item.name} />
          <div className="details-thumbs">
            {pictures.map((pic, i) => (
              <img
                key={i}
                src={pic}
                alt={`${item.name} ${i + 1}`}
                className={`details-thumb ${mainImg === pic ? 'active' : ''}`}
                onClick={() => setMainImg(pic)}
              />
            ))}
          </div>
        </div>

        {/* ── Infos ── */}
        <div className="details-info">
          <p className="details-brand">{item.brand}</p>
          <h2 className="details-title">{item.name}</h2>

          {item.avis && (
            <p className="details-avis">
              {renderStars(item.avis.stars)} <span>({item.avis.nb} avis)</span>
            </p>
          )}

          <p className="details-price">{item.price.toFixed(2)} €</p>

          <p className={available ? 'in-stock' : 'out-of-stock'}>
            {available ? `En stock (${item.stock})` : 'Rupture de stock'}
          </p>

          {/* Sélecteur de taille */}
          {item.size && item.size.length > 0 && (
            <div className="size-section">
              <p className="size-label">
                Sélectionner une taille
                {sizeError && <span className="size-error"> — Veuillez choisir une taille</span>}
              </p>
              <div className="size-grid">
                {item.size.map((s) => (
                  <button
                    key={s}
                    className={`size-option ${selectedSize === s ? 'selected' : ''}`}
                    onClick={() => { setSelectedSize(s); setSizeError(false); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="details-desc">{item.content}</p>

          {/* Actions */}
          <div className="details-actions">
            <button
              className="btn-add-cart"
              onClick={handleAddToCart}
              disabled={!available}
            >
              {added ? '✓ Ajouté au panier !' : available ? 'Ajouter au panier' : 'Indisponible'}
            </button>

            <button className="btn-fav-detail" onClick={handleFavorite}>
              {fav ? '❤️ Retirer des favoris' : '🤍 Ajouter aux favoris'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
