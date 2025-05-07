import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [promotions, setPromotions] = useState([]);
  const [promotionDiscount, setPromotionDiscount] = useState(0);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const promotionsCollection = collection(db, 'promotions');
    const unsubscribe = onSnapshot(promotionsCollection, (snapshot) => {
      const activePromos = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((promo) => promo.active || promo.Active);
      setPromotions(activePromos);
    }, (error) => {
      console.error('Error fetching promotions:', error);
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (item) => {
    const promotion = promotions.find(
      (promo) => (promo.category || promo.Category) === item.category && (promo.size || promo.Size) === item.size
    );
    setCartItems((prevItems) => {
      const updated = [...prevItems];
      const existingIndex = updated.findIndex(
        (i) => i.name === item.name && i.size === item.size
      );
      if (existingIndex !== -1) {
        updated[existingIndex].quantity += item.quantity;
      } else {
        updated.push({
          ...item,
          name: item.name || item.title || 'Unknown Item',
          promotion: promotion || null,
        });
      }
      return updated;
    });
  };

  const removeFromCart = (itemOrId) => {
    setCartItems((prevItems) => {
      if (typeof itemOrId === 'object' && itemOrId.id) {
        return prevItems.filter((item) => item.id !== itemOrId.id);
      } else if (typeof itemOrId === 'object' && itemOrId.name && itemOrId.size) {
        return prevItems.filter(
          (item) => !(item.name === itemOrId.name && item.size === itemOrId.size)
        );
      }
      return prevItems;
    });
  };

  const increaseQuantity = (index) => {
    setCartItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (index) => {
    setCartItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      )
    );
  };

  const updateQuantity = (item, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((cartItem) => {
        if (cartItem.name === item.name && cartItem.size === item.size) {
          return { ...cartItem, quantity: Math.max(1, newQuantity) };
        }
        return cartItem;
      })
    );
  };

  const clearCart = () => {
    if (cartItems.length > 0) {
      setCartItems([]);
      localStorage.removeItem('cartItems');
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const calculatePromoDiscount = useCallback(() => {
    let totalDiscount = 0;
    let totalPromoPrice = 0;
    let totalRegularPrice = 0;

    const promoGroups = {};

    cartItems.forEach((item) => {
      if (item.promotion) {
        const key = `${item.category}-${item.size}`;
        if (!promoGroups[key]) {
          promoGroups[key] = {
            promotion: item.promotion,
            totalQuantity: 0,
            items: [],
          };
        }
        promoGroups[key].totalQuantity += item.quantity;
        promoGroups[key].items.push(item);
      }
    });

    Object.values(promoGroups).forEach((group) => {
      const { promotion, totalQuantity, items } = group;
      const requiredQuantity = promotion.requiredQuantity || 1;
      const promoPrice = promotion.size === 'reg' ? promotion.priceReg : promotion.priceLrg;

      const qualifyingSets = Math.floor(totalQuantity / requiredQuantity);
      if (qualifyingSets > 0) {
        const qualifyingItemsQuantity = qualifyingSets * requiredQuantity;
        let regularPriceForQualifyingItems = 0;

        let remainingQuantity = qualifyingItemsQuantity;
        for (const item of items) {
          if (remainingQuantity <= 0) break;
          const quantityToUse = Math.min(item.quantity, remainingQuantity);
          regularPriceForQualifyingItems += quantityToUse * item.price;
          remainingQuantity -= quantityToUse;
        }

        const promoPriceForQualifyingSets = qualifyingSets * promoPrice;
        totalPromoPrice += promoPriceForQualifyingSets;
        totalRegularPrice += regularPriceForQualifyingItems;

        const discount = regularPriceForQualifyingItems - promoPriceForQualifyingSets;
        totalDiscount += discount > 0 ? discount : 0;
      }
    });

    if (totalPromoPrice > totalRegularPrice) {
      totalDiscount = 0;
    }

    return Number.isFinite(totalDiscount) ? totalDiscount : 0;
  }, [cartItems]); // Dependencies for calculatePromoDiscount

  const calculatePromoTotal = () => {
    let totalPromoPrice = 0;

    const promoGroups = {};

    cartItems.forEach((item) => {
      if (item.promotion) {
        const key = `${item.category}-${item.size}`;
        if (!promoGroups[key]) {
          promoGroups[key] = {
            promotion: item.promotion,
            totalQuantity: 0,
            items: [],
          };
        }
        promoGroups[key].totalQuantity += item.quantity;
        promoGroups[key].items.push(item);
      }
    });

    Object.values(promoGroups).forEach((group) => {
      const { promotion, totalQuantity, items } = group;
      const requiredQuantity = promotion.requiredQuantity || 1;
      const promoPrice = promotion.size === 'reg' ? promotion.priceReg : promotion.priceLrg;

      const qualifyingSets = Math.floor(totalQuantity / requiredQuantity);
      if (qualifyingSets > 0) {
        const promoPriceForQualifyingSets = qualifyingSets * promoPrice;
        totalPromoPrice += promoPriceForQualifyingSets;

        const remainingItems = totalQuantity % requiredQuantity;
        if (remainingItems > 0) {
          let remainingQuantity = remainingItems;
          for (const item of items) {
            if (remainingQuantity <= 0) break;
            const quantityToUse = Math.min(item.quantity, remainingQuantity);
            totalPromoPrice += quantityToUse * item.price;
            remainingQuantity -= quantityToUse;
          }
        }
      } else {
        for (const item of items) {
          totalPromoPrice += item.price * item.quantity;
        }
      }
    });

    cartItems.forEach((item) => {
      if (!item.promotion) {
        totalPromoPrice += item.price * item.quantity;
      }
    });

    return Number.isFinite(totalPromoPrice) ? totalPromoPrice : 0;
  };

  useEffect(() => {
    const discount = calculatePromoDiscount();
    if (promotionDiscount !== discount) {
      setPromotionDiscount(discount);
    }
  }, [cartItems, promotions, promotionDiscount, calculatePromoDiscount]); // Added calculatePromoDiscount

  const calculateTotal = (includeDiscount = true) => {
    if (includeDiscount) {
      return calculatePromoTotal();
    }
    return getSubtotal();
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        updateQuantity,
        clearCart,
        getSubtotal,
        calculatePromoDiscount,
        calculateTotal,
        getTotalItems,
        promotions,
        promotionDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}