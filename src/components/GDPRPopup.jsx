import React, { useState, useEffect } from 'react';

const GDPRPopup = ({ onAccept, onReject }) => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('gdprConsent');
    if (!consent) {
      setShowPopup(true);
    } else {
      if (consent === 'accepted') onAccept?.();
      if (consent === 'rejected') onReject?.();
    }
  }, [onAccept, onReject]);

  const handleAccept = () => {
    localStorage.setItem('gdprConsent', 'accepted');
    onAccept?.(); // Optional hook
    setShowPopup(false);
  };

  const handleReject = () => {
    localStorage.setItem('gdprConsent', 'rejected');
    onReject?.(); // Optional hook
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 shadow-lg z-50">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-center md:text-left">
          We use cookies to improve your experience. By continuing, you agree to our use of cookies.
          <a href="/privacy-policy" className="underline text-blue-400 ml-1">
            Learn more
          </a>.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleReject}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default GDPRPopup;
