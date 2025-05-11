import React, { useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useNavigate, useLocation } from 'react-router-dom';

function CartModal({ isOpen, onClose }) {
  const {
    cartItems = [],
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal,
  } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Auto-close on success or cancel pages
  useEffect(() => {
    if (location.pathname === '/success' || location.pathname === '/cancel') {
      onClose?.();
    }
  }, [location.pathname, onClose]);

  if (!isOpen) return null;

  const getItemName = (item) => item.name || item.title || 'Unknown Item';

  const isPromotionApplied = (item) => {
    if (!item.promotion) return false;

    const matchingItems = cartItems.filter(
      (i) => i.category === item.category && i.size === item.size
    );
    const totalQuantity = matchingItems.reduce((sum, i) => sum + i.quantity, 0);
    return totalQuantity >= (item.promotion.requiredQuantity || 1);
  };

  const getPromotionEncouragement = (item) => {
    if (!item.promotion) return null;

    const matchingItems = cartItems.filter(
      (i) => i.category === item.category && i.size === item.size
    );
    const totalQuantity = matchingItems.reduce((sum, i) => sum + i.quantity, 0);
    const required = item.promotion.requiredQuantity || 1;

    if (totalQuantity < required) {
      const remaining = required - totalQuantity;
      return `Add ${remaining} more ${remaining > 1 ? 'items' : 'item'} to get ${item.promotion.description}!`;
    }
    return null;
  };

  const calculatePromoPriceForItem = (item) => {
    if (!isPromotionApplied(item)) return 0;

    const matchingItems = cartItems.filter(
      (i) => i.category === item.category && i.size === item.size
    );
    const totalQuantity = matchingItems.reduce((sum, i) => sum + i.quantity, 0);
    const requiredQuantity = item.promotion.requiredQuantity || 1;
    const promoPrice = item.promotion.size === 'reg' ? item.promotion.priceReg : item.promotion.priceLrg;
    const qualifyingSets = Math.floor(totalQuantity / requiredQuantity);
    return qualifyingSets * promoPrice;
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
      onClick={onClose} // ✅ Dismiss when clicking the background
    >
      <div
        className="bg-white rounded-lg w-full max-w-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()} // ✅ Prevent click inside modal from dismissing
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-coco-yellow"
          aria-label="Close basket modal"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-black">Your Basket</h2>

        <div className="space-y-4 max-h-[50vh] overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-coco-gray">Your basket is empty.</p>
          ) : (
            cartItems.map((item, index) => {
              const itemName = getItemName(item);
              const regularTotal = item.price * item.quantity;
              const hasPromo = isPromotionApplied(item);
              const promoTotal = calculatePromoPriceForItem(item);

              return (
                <div
                  key={`${itemName}-${item.size}-${index}`}
                  className="flex justify-between items-center bg-gray-100 p-4 rounded-md"
                >
                  <div>
                    <p className="font-semibold text-black">
                      {itemName} ({item.size?.toUpperCase()})
                    </p>
                    <p className="text-sm text-coco-gray">Qty: {item.quantity}</p>

                    {hasPromo && promoTotal > 0 ? (
                      <div className="mt-1 text-sm">
                        <p className="text-green-600">
                          {item.promotion.description} Applied!
                        </p>
                        <p className="text-green-600 font-bold">
                          Promo: £{promoTotal.toFixed(2)}
                        </p>
                        <p className="line-through text-xs text-gray-500">
                          Was: £{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <>
                        {getPromotionEncouragement(item) && (
                          <p className="text-sm text-coco-orange mt-1">
                            {getPromotionEncouragement(item)}
                          </p>
                        )}
                        <p className="text-black font-medium mt-1">
                          £{regularTotal.toFixed(2)}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item, item.quantity - 1)}
                      className="bg-gray-300 hover:bg-gray-400 text-black rounded px-2"
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease quantity of ${itemName}`}
                    >
                      -
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full font-semibold shadow-inner">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item, item.quantity + 1)}
                      className="bg-gray-300 hover:bg-gray-400 text-black rounded px-2"
                      aria-label={`Increase quantity of ${itemName}`}
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeFromCart(item)}
                      className="text-red-500 hover:text-red-600"
                      aria-label={`Remove ${itemName}`}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-lg text-black">
              <span>Subtotal:</span>
              <span>£{(calculateTotal(false) || 0).toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-xl text-black">
              <span>Total:</span>
              <span>£{(calculateTotal(true) || 0).toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2 justify-between">
          <button
            onClick={clearCart}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            disabled={cartItems.length === 0}
          >
            Clear Basket
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/menu');
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/order-online');
            }}
            className="bg-coco-yellow hover:bg-coco-orange text-black font-bold py-2 px-6 rounded"
            disabled={cartItems.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartModal;
