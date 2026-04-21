import { useState, useMemo, useEffect } from 'react';
import data from '../service/data.json';
import ProductCard from './ProductCard';
import { SkeletonGrid } from './SkeletonCard';

function CategoryPage({ categories, title }) {
  const base = data.filter((item) => categories.includes(item.category));
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [sortBy, setSortBy]           = useState('default');
  const [filterStock, setFilterStock] = useState(false);
  const [priceMax, setPriceMax]       = useState('');
  const [minRating, setMinRating]     = useState(0);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [categories]);

  const filtered = useMemo(() => {
    let result = [...base];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((i) => i.name.toLowerCase().includes(q) || i.brand.toLowerCase().includes(q));
    }
    if (filterStock) result = result.filter((i) => i.stock > 0 && i.online);
    if (priceMax !== '') result = result.filter((i) => i.price <= Number(priceMax));
    if (minRating > 0) result = result.filter((i) => i.avis && i.avis.stars >= minRating);
    if (sortBy === 'price-asc')  result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating')     result.sort((a, b) => (b.avis?.stars ?? 0) - (a.avis?.stars ?? 0));
    return result;
  }, [base, search, sortBy, filterStock, priceMax, minRating]);

  const hasFilters = search || filterStock || priceMax || minRating > 0 || sortBy !== 'default';
  const reset = () => { setSearch(''); setSortBy('default'); setFilterStock(false); setPriceMax(''); setMinRating(0); };

  return (
    <div className="page-content">
      {title && <h1>{title}</h1>}
      <div className="filters-bar">
        <input className="search-input" type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="default">Trier par</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="rating">Meilleures notes</option>
        </select>
        <input className="filter-select" type="number" placeholder="Prix max (€)" min="0" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
        <select className="filter-select" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
          <option value={0}>Note minimale</option>
          <option value={3}>★★★ et +</option>
          <option value={4}>★★★★ et +</option>
          <option value={5}>★★★★★</option>
        </select>
        <label className="filter-toggle">
          <input type="checkbox" checked={filterStock} onChange={(e) => setFilterStock(e.target.checked)} />
          En stock uniquement
        </label>
        {hasFilters && <button className="btn-reset" onClick={reset}>Réinitialiser</button>}
      </div>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : (
        <>
          <p className="results-count">{filtered.length} article{filtered.length > 1 ? 's' : ''}</p>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <p>Aucun article ne correspond à votre recherche.</p>
            </div>
          ) : (
            <div className="articles-container">
              {filtered.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CategoryPage;
