import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function OrderCard({ order }) {
  const [localPrepTime, setLocalPrepTime] = useState(order.prepTime || 0);
  const isEditable = order.status === 'pending' || order.status === 'confirmed';

  useEffect(() => {
    setLocalPrepTime(order.prepTime || 0);
  }, [order.prepTime]);

  const updatePrepTime = async (newTime) => {
    try {
      const orderRef = doc(db, 'orders', order.id);
      await updateDoc(orderRef, { prepTime: newTime });
      console.log(`✅ Updated prep time for order ${order.id} to ${newTime}`);
    } catch (error) {
      console.error('Error updating prep time:', error);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const orderRef = doc(db, 'orders', order.id);
      await updateDoc(orderRef, { status: newStatus });
      console.log(`✅ Updated status for order ${order.id} to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md border border-gray-300">
      {/* Header */}
      <div className="mb-4 space-y-1">
        <h2 className="text-xl font-bold text-coco-orange">
          Order #{order.id.slice(0, 8)}
        </h2>
        {order.customer_name && (
          <p className="text-sm text-black">
            <span className="font-semibold">Name:</span> {order.customer_name}
          </p>
        )}
        {order.customer_email && (
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Email:</span> {order.customer_email}
          </p>
        )}
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Total:</span> £{order.totalAmount.toFixed(2)}
        </p>
      </div>

      {/* Items */}
      <ul className="text-black ml-4 mb-4">
        {order.items.map((item, idx) => (
          <li key={idx}>
            - {item.name} ({item.size}) × {item.quantity}
          </li>
        ))}
      </ul>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Prep Time */}
        <div className="flex items-center gap-2">
          <label className="text-black font-medium">Prep Time:</label>
          <input
            type="number"
            min="0"
            value={localPrepTime}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setLocalPrepTime(val);
              if (isEditable) updatePrepTime(val);
            }}
            disabled={!isEditable}
            className={`w-20 p-1 rounded border ${
              isEditable
                ? 'border-gray-400'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          />
          <span className="text-sm text-gray-600">minutes</span>
        </div>

        {/* Status Buttons */}
        <div className="flex gap-3 flex-wrap items-center">
          {order.status === 'pending' && (
            <button
              onClick={() => updateStatus('confirmed')}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-bold"
            >
              Confirm & Notify
            </button>
          )}
          {order.status !== 'completed' && (
            <button
              onClick={() => updateStatus('completed')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-bold"
            >
              Mark as Completed
            </button>
          )}
          <span
            className={`px-4 py-2 border rounded text-sm font-semibold ${
              order.status === 'completed'
                ? 'bg-green-100 text-green-700 border-green-300'
                : order.status === 'refunded'
                ? 'bg-red-100 text-red-700 border-red-300'
                : 'bg-yellow-100 text-yellow-700 border-yellow-300'
            }`}
          >
            Status: {order.status}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;
