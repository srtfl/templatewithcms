import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

function CancelPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionDetails, setSessionDetails] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
      fetch(`${backendUrl}/verify-session?session_id=${sessionId}`)
        .then(response => response.json())
        .then(data => setSessionDetails(data))
        .catch(error => console.error('Error verifying session:', error));
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-red-50 rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Payment Canceled</h1>
        <p className="text-coco-gray mb-6">
          {sessionDetails?.error 
            ? sessionDetails.error 
            : 'Your payment was not completed. Please try again.'}
        </p>
        <button
          onClick={() => navigate('/order-online')}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full shadow transition"
        >
          Return to Checkout
        </button>
      </motion.div>
    </div>
  );
}

export default CancelPage;