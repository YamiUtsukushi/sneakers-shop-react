import { createContext, useContext, useReducer, useEffect } from 'react';

// ─── State initial ────────────────────────────────────────────────────────────
const initialState = {
  cart: [],      // [{ item, quantity }]
  favorites: [], // [item.id, ...]
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function shopReducer(state, action) {
  switch (action.type) {

    // PANIER
    case 'CART_ADD': {
      const existing = state.cart.find(
        (e) => e.item.id === action.item.id
      );
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((e) =>
            e.item.id === action.item.id
              ? { ...e, quantity: e.quantity + 1 }
              : e
          ),
        };
      }
      return { ...state, cart: [...state.cart, { item: action.item, quantity: 1 }] };
    }

    case 'CART_REMOVE':
      return {
        ...state,
        cart: state.cart.filter((e) => e.item.id !== action.id),
      };

    case 'CART_UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter((e) => e.item.id !== action.id),
        };
      }
      return {
        ...state,
        cart: state.cart.map((e) =>
          e.item.id === action.id ? { ...e, quantity: action.quantity } : e
        ),
      };
    }

    case 'CART_CLEAR':
      return { ...state, cart: [] };

    // FAVORIS
    case 'FAVORITES_TOGGLE': {
      const isFav = state.favorites.includes(action.id);
      return {
        ...state,
        favorites: isFav
          ? state.favorites.filter((id) => id !== action.id)
          : [...state.favorites, action.id],
      };
    }

    // HYDRATATION depuis localStorage
    case 'HYDRATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [state, dispatch] = useReducer(shopReducer, initialState);

  // Hydratation initiale depuis localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('shopState');
      if (saved) {
        dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) });
      }
    } catch {
      // localStorage corrompu → on ignore
    }
  }, []);

  // Persistence à chaque changement
  useEffect(() => {
    localStorage.setItem('shopState', JSON.stringify(state));
  }, [state]);

  // Helpers exposés
  const cartTotal = state.cart.reduce(
    (sum, e) => sum + e.item.price * e.quantity,
    0
  );
  const cartCount = state.cart.reduce((sum, e) => sum + e.quantity, 0);
  const isFavorite = (id) => state.favorites.includes(id);

  return (
    <ShopContext.Provider value={{ state, dispatch, cartTotal, cartCount, isFavorite }}>
      {children}
    </ShopContext.Provider>
  );
}

// Hook d'accès
export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop doit être utilisé dans un ShopProvider');
  return ctx;
}
