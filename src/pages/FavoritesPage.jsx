import { useShop } from '../context/ShopContext';
import data from '../service/data.json';
import ProductCard from '../components/ProductCard';

function FavoritesPage() {
  const { state } = useShop();

  const favorites = data.filter((item) => state.favorites.includes(item.id));

  return (
    <div className="page-content">
      <h1>Mes favoris</h1>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🤍</span>
          <p>Vous n'avez pas encore de favoris.</p>
          <p className="empty-hint">Cliquez sur le cœur d'un article pour l'ajouter ici.</p>
        </div>
      ) : (
        <>
          <p className="favorites-count">
            {favorites.length} article{favorites.length > 1 ? 's' : ''} sauvegardé{favorites.length > 1 ? 's' : ''}
          </p>
          <div className="articles-container">
            {favorites.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default FavoritesPage;
