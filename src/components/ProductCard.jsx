import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

function ProductCard({ item, onDelete }) {
  const { dispatch, isFavorite } = useShop();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const available = item.online && item.stock > 0;
  const fav = isFavorite(item.id);

  const handleFavorite = (e) => {
    e.stopPropagation(); // ne pas déclencher le clic de la carte
    dispatch({ type: 'FAVORITES_TOGGLE', id: item.id });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch({ type: 'CART_ADD', item });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(item.id);
  };

  const handleCardClick = () => {
    navigate(`/details/${item.id}`);
  };

  const renderStars = (stars) => {
    const full = Math.floor(stars);
    const half = stars % 1 >= 0.5;
    return (
      <span>
        {'★'.repeat(full)}
        {half ? '½' : ''}
        {'☆'.repeat(5 - full - (half ? 1 : 0))}
      </span>
    );
  };

  return (
    <div className="card" onClick={handleCardClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
    >
      {/* Favori */}
      <button className="btn-favorite" onClick={handleFavorite} aria-label="Favoris">
        {fav ? '❤️' : '🤍'}
      </button>

      <img src={item.picture[0].pic1} alt={item.name} />

      <h2>{item.name}</h2>
      <p className="brand">{item.brand}</p>
      <p className="description">{item.content}</p>
      <p className="price">{item.price.toFixed(2)} €</p>

      <p className={available ? 'in-stock' : 'out-of-stock'}>
        {available ? `En stock (${item.stock})` : 'Rupture de stock'}
      </p>

      {item.avis && (
        <p className="avis">
          {renderStars(item.avis.stars)} <span>({item.avis.nb} avis)</span>
        </p>
      )}

      <div className="card-actions">
        <button onClick={handleAddToCart} disabled={!available}>
          {available ? 'Ajouter au panier' : 'Indisponible'}
        </button>

        {isAdmin && onDelete && (
          <button className="btn-delete" onClick={handleDelete}>
            🗑 Supprimer
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
