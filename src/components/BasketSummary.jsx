import React from 'react';
import { useCart } from '../contexts/CartContext';

function BasketSummary() {
  const { cartItems, clearCart, getSubtotal, calculatePromoDiscount } = useCart();

  if (cartItems.length === 0) {
    return null;
  }

  const subtotal = getSubtotal();
  const discount = calculatePromoDiscount();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-yellow-400 text-gray-900 rounded-full px-6 py-3 shadow-lg flex items-center space-x-4">
        <span className="font-bold text-lg">
          View Basket ({cartItems.length} items) - £{(subtotal - discount).toFixed(2)}
          {discount > 0 && (
            <span className="text-sm text-green-700 ml-2">(Saved £{discount.toFixed(2)})</span>
          )}
        </span>
        <button
          onClick={clearCart}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}

export default BasketSummary;