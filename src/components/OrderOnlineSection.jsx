import React, { useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

// Log the Stripe key for debugging
console.log('Stripe Publishable Key:', process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function OrderOnlineSection() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal,
    promotionDiscount,
  } = useCart();

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCheckout = async () => {
    try {
      const sanitizedCartItems = cartItems
        .map(item => ({
          id: item.id,
          name: item.name || 'Unknown Item',
          size: item.size || 'reg',
          price: Number(item.price) || 0,
          quantity: parseInt(item.quantity, 10) || 1,
        }))
        .filter(item => item.price > 0 && item.quantity > 0);

      if (sanitizedCartItems.length === 0) {
        throw new Error('No valid items in cart');
      }

      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
      const apiEndpoint = `${backendUrl}/create-checkout-session`;
      console.log('Using backend URL:', backendUrl);
      console.log('Sending cartItems to backend:', sanitizedCartItems);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: sanitizedCartItems,
          totalAmount: calculateTotal(true),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      console.log('Stripe session URL received:', data.url);

      if (!data.url) {
        throw new Error('Stripe session URL not returned');
      }

      // Redirect to Stripe-hosted checkout page
      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred while processing your checkout: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 pt-24 min-h-screen bg-white relative">
      {/* Left - Cart Items */}
      <div className="flex-1">
        <div className="relative inline-block mb-6">
          <h2 className="text-5xl font-bold text-black uppercase">Your Order</h2>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 border-t-2 border-coco-orange w-1/2"></div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-coco-gray text-2xl mt-12">
            Your basket is empty.
            <button
              onClick={() => navigate('/menu')}
              className="text-coco-yellow hover:underline ml-2"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={`${item.name}-${item.size}`}
                className="flex justify-between items-center bg-gray-100 p-6 rounded-lg shadow-md"
              >
                <div>
                  <p className="font-semibold text-black text-lg">
                    {item.name} ({item.size.toUpperCase()})
                  </p>
                  <p className="text-sm text-coco-gray">Qty: {item.quantity}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item, item.quantity - 1)}
                    className="bg-gray-300 hover:bg-gray-400 text-black rounded-full w-8 h-8 flex items-center justify-center"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black font-semibold shadow-inner">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item, item.quantity + 1)}
                    className="bg-gray-300 hover:bg-gray-400 text-black rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeFromCart(item)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={clearCart}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full"
            >
              Clear Basket
            </button>
          </div>
        )}
      </div>

      {/* Right - Summary */}
      <div className="w-full md:w-2/5">
        <div className="relative inline-block mb-6">
          <h2 className="text-5xl font-bold text-black uppercase">Order Summary</h2>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 border-t-2 border-coco-orange w-1/2"></div>
        </div>

        <div className="space-y-4 bg-gray-100 p-8 rounded-lg shadow-md">
          <div className="flex justify-between text-black">
            <span>Subtotal:</span>
            <span>£{calculateTotal(false).toFixed(2)}</span>
          </div>
          {promotionDiscount > 0 && (
            <div className="flex justify-between text-green-500 text-sm">
              <span>Promotion Discount:</span>
              <span>-£{promotionDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-xl border-t border-gray-300 pt-4 text-black">
            <span>Total:</span>
            <span>£{calculateTotal(true).toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <button
            onClick={() => navigate('/menu')}
            className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-3 px-6 rounded-full"
          >
            Continue Shopping
          </button>

          {cartItems.length > 0 && (
            <button
              onClick={handleCheckout}
              className="bg-coco-yellow hover:bg-coco-orange text-black font-bold py-3 px-6 rounded-full"
            >
              Place Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderOnlineSection;