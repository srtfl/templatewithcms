// 1. CookieConsent.js
import React, { useEffect, useState } from 'react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) setShowBanner(true);
  }, []);

  const handleConsent = (accepted) => {
    localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 text-sm flex justify-between items-center z-50">
      <span>
        We use cookies to improve your experience. By using our site, you agree to our cookie policy.
      </span>
      <div className="space-x-2">
        <button
          onClick={() => handleConsent(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
        >
          Accept
        </button>
        <button
          onClick={() => handleConsent(false)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;