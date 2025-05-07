import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function CheckoutForm() {
  const navigate = useNavigate();
  const { cartItems, totalAmount, clearCart } = useCart();

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
  
      const apiEndpoint = `${backendUrl}/create-checkout-session`;
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: sanitizedCartItems,
          totalAmount: calculateTotal(true),
        }),
      });
  
      const data = await response.json();
      if (!data.url) {
        throw new Error('Stripe session URL not returned');
      }
  
      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred while processing your checkout: ' + error.message);
    }
  };
  

  return (
    <button
      className="bg-yellow-500 text-black px-4 py-2 rounded font-bold hover:bg-yellow-600"
      onClick={handlePaymentSuccess}
    >
      Pay & Place Order
    </button>
  );
}

export default CheckoutForm;
