import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const STEPS = ['Livraison', 'Paiement', 'Confirmation'];

function CheckoutPage() {
  const { state, cartTotal, dispatch } = useShop();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', address: '',
    city: '', zip: '', country: 'France',
    cardNumber: '', cardName: '', expiry: '', cvv: '',
  });

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const total = (cartTotal + (cartTotal >= 100 ? 0 : 5.99)).toFixed(2);

  const handleConfirm = () => {
    dispatch({ type: 'CART_CLEAR' });
    setStep(2);
  };

  return (
    <div className="page-content">
      <h1>Commande</h1>

      {/* Stepper */}
      <div className="checkout-stepper">
        {STEPS.map((s, i) => (
          <div key={s} className={`step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            <span className="step-num">{i < step ? '✓' : i + 1}</span>
            <span className="step-label">{s}</span>
            {i < STEPS.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        {/* ── Étape 0 : Livraison ── */}
        {step === 0 && (
          <div className="checkout-form">
            <h3>Adresse de livraison</h3>
            <div className="form-grid-2">
              <div className="field"><label>Prénom *</label><input value={form.firstName} onChange={e => set('firstName', e.target.value)} required /></div>
              <div className="field"><label>Nom *</label><input value={form.lastName} onChange={e => set('lastName', e.target.value)} required /></div>
              <div className="field full-2"><label>Email *</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} required /></div>
              <div className="field full-2"><label>Adresse *</label><input value={form.address} onChange={e => set('address', e.target.value)} required /></div>
              <div className="field"><label>Ville *</label><input value={form.city} onChange={e => set('city', e.target.value)} required /></div>
              <div className="field"><label>Code postal *</label><input value={form.zip} onChange={e => set('zip', e.target.value)} required /></div>
              <div className="field full-2">
                <label>Pays</label>
                <select value={form.country} onChange={e => set('country', e.target.value)}>
                  <option>France</option><option>Belgique</option><option>Suisse</option><option>Canada</option>
                </select>
              </div>
            </div>
            <button className="btn-checkout" onClick={() => setStep(1)}>Continuer vers le paiement →</button>
          </div>
        )}

        {/* ── Étape 1 : Paiement ── */}
        {step === 1 && (
          <div className="checkout-form">
            <h3>Informations de paiement</h3>
            <p className="checkout-secure">🔒 Paiement simulé — aucune donnée réelle collectée</p>
            <div className="form-grid-2">
              <div className="field full-2">
                <label>Numéro de carte</label>
                <input placeholder="1234 5678 9012 3456" maxLength={19}
                  value={form.cardNumber}
                  onChange={e => set('cardNumber', e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim())}
                />
              </div>
              <div className="field full-2"><label>Nom sur la carte</label><input placeholder="JEAN DUPONT" value={form.cardName} onChange={e => set('cardName', e.target.value.toUpperCase())} /></div>
              <div className="field"><label>Date d'expiration</label><input placeholder="MM/AA" maxLength={5} value={form.expiry} onChange={e => set('expiry', e.target.value)} /></div>
              <div className="field"><label>CVV</label><input placeholder="•••" maxLength={3} type="password" value={form.cvv} onChange={e => set('cvv', e.target.value)} /></div>
            </div>
            <div className="checkout-btn-row">
              <button className="btn-back" onClick={() => setStep(0)}>← Retour</button>
              <button className="btn-checkout" onClick={handleConfirm}>Confirmer la commande</button>
            </div>
          </div>
        )}

        {/* ── Étape 2 : Confirmation ── */}
        {step === 2 && (
          <div className="checkout-confirm">
            <div className="confirm-icon">✓</div>
            <h2>Commande confirmée !</h2>
            <p>Merci {form.firstName}, votre commande a bien été enregistrée.</p>
            <p className="confirm-email">Un récapitulatif a été envoyé à <strong>{form.email || 'votre adresse email'}</strong>.</p>
            <p className="confirm-total">Total payé : <strong>{total} €</strong></p>
            <button className="btn-checkout" onClick={() => navigate('/shop')}>Retour à la boutique</button>
          </div>
        )}

        {/* ── Récap commande ── */}
        {step < 2 && (
          <div className="cart-summary checkout-recap">
            <h3>Votre commande</h3>
            {state.cart.map(({ item, quantity }) => (
              <div key={item.id} className="recap-line">
                <span>{item.name} {item.selectedSize ? `(${item.selectedSize})` : ''} × {quantity}</span>
                <span>{(item.price * quantity).toFixed(2)} €</span>
              </div>
            ))}
            <div className="summary-line"><span>Livraison</span><span>{cartTotal >= 100 ? 'Offerte' : '5.99 €'}</span></div>
            <div className="summary-line summary-total"><span>Total</span><span>{total} €</span></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutPage;
