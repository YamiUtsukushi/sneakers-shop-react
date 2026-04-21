function SkeletonCard() {
  return (
    <div className="card skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-brand" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-price" />
      <div className="skeleton skeleton-btn" />
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="articles-container">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default SkeletonCard;
