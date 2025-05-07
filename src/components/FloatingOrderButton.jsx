import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

function FloatingOrderButton() {
  const { cartItems, calculateTotal } = useCart();
  const navigate = useNavigate();
  const [pulse, setPulse] = useState(false);
  const [shake, setShake] = useState(false);

  const subtotal = calculateTotal(true).toFixed(2);
  const itemCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

  useEffect(() => {
    if (cartItems.length > 0) {
      setPulse(true);
      const timeout = setTimeout(() => setPulse(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [cartItems]);

  const handleClick = () => {
    if (itemCount > 0) {
      navigate('/order-online');
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  if (itemCount === 0) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-4 right-4 bg-coco-yellow hover:bg-coco-orange text-black font-bold py-3 px-6 rounded-full shadow-lg transition-all flex items-center space-x-3
        ${pulse ? 'scale-105 ring-2 ring-coco-orange' : ''}
        ${shake ? 'animate-shake' : ''}`}
    >
      <FaShoppingCart className="text-lg" />
      <div className="text-left">
        <div className="text-sm font-bold">View Basket</div>
        <div className="text-xs">
          ({itemCount} item{itemCount > 1 ? 's' : ''}) - £{subtotal}
        </div>
      </div>
    </button>
  );
}

export default FloatingOrderButton;