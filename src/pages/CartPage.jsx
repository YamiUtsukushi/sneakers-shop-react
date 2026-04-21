import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const { state, dispatch, cartTotal } = useShop();
  const navigate = useNavigate();
  const { cart } = state;

  if (cart.length === 0) {
    return (
      <div className="page-content">
        <h1>Mon panier</h1>
        <div className="empty-state">
          <span className="empty-icon">🛒</span>
          <p>Votre panier est vide.</p>
          <p className="empty-hint">Parcourez le catalogue pour ajouter des articles.</p>
          <button className="btn-continue" onClick={() => navigate('/shop')}>
            Continuer les achats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h1>Mon panier</h1>

      <div className="cart-layout">
        {/* ── Liste articles ── */}
        <div className="cart-items">
          {cart.map(({ item, quantity }) => (
            <div key={`${item.id}-${item.selectedSize}`} className="cart-row">
              <img src={item.picture[0].pic1} alt={item.name} className="cart-thumb" />

              <div className="cart-info">
                <p className="cart-name">{item.name}</p>
                <p className="cart-brand">{item.brand}</p>
                {item.selectedSize && (
                  <p className="cart-size">Taille : {item.selectedSize}</p>
                )}
                <p className="cart-unit-price">{item.price.toFixed(2)} € / unité</p>
              </div>

              <div className="cart-qty">
                <button onClick={() => dispatch({ type: 'CART_UPDATE_QUANTITY', id: item.id, quantity: quantity - 1 })}>−</button>
                <span>{quantity}</span>
                <button onClick={() => dispatch({ type: 'CART_UPDATE_QUANTITY', id: item.id, quantity: quantity + 1 })}>+</button>
              </div>

              <div className="cart-subtotal">
                {(item.price * quantity).toFixed(2)} €
              </div>

              <button
                className="cart-remove"
                onClick={() => dispatch({ type: 'CART_REMOVE', id: item.id })}
                aria-label="Supprimer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* ── Récap ── */}
        <div className="cart-summary">
          <h3>Récapitulatif</h3>

          <div className="summary-line">
            <span>Sous-total</span>
            <span>{cartTotal.toFixed(2)} €</span>
          </div>
          <div className="summary-line">
            <span>Livraison</span>
            <span>{cartTotal >= 100 ? 'Offerte' : '5.99 €'}</span>
          </div>
          <div className="summary-line summary-total">
            <span>Total</span>
            <span>{(cartTotal + (cartTotal >= 100 ? 0 : 5.99)).toFixed(2)} €</span>
          </div>

          {cartTotal < 100 && (
            <p className="free-shipping-hint">
              Plus que {(100 - cartTotal).toFixed(2)} € pour la livraison offerte
            </p>
          )}

          <button className="btn-checkout" onClick={() => navigate('/checkout')}>
            Commander
          </button>

          <button className="btn-continue-sm" onClick={() => navigate('/shop')}>
            Continuer les achats
          </button>

          <button
            className="btn-clear-cart"
            onClick={() => dispatch({ type: 'CART_CLEAR' })}
          >
            Vider le panier
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
