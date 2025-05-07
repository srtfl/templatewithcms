import React, { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import axios from "axios";

const SuccessPage = () => {
  const { clearCart } = useCart();
  const [status, setStatus] = useState("processing"); // "processing" | "success" | "failed"

  useEffect(() => {
    const verifySession = async () => {
      const sessionId = new URLSearchParams(window.location.search).get("session_id");
      if (!sessionId) {
        setStatus("failed");
        return;
      }
  
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/verify-session?session_id=${sessionId}`
        );
        console.log("✅ Session verified & order saved:", res.data);
        clearCart();
        setStatus("success");
      } catch (error) {
        console.error("❌ Session verification failed:", error);
        setStatus("failed");
      }
    };
  
    verifySession();
  }, [clearCart]);
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        {status === "processing" && (
          <>
            <h1 className="text-2xl font-semibold text-gray-600 mb-4">Processing your order...</h1>
            <p className="text-gray-500">Please wait a moment while we confirm your purchase.</p>
          </>
        )}
        {status === "success" && (
          <>
            <h1 className="text-3xl font-bold text-green-600 mb-4">Order Successful!</h1>
            <p className="text-gray-700 mb-6">Thank you for your order. It has been processed.</p>
            <a
              href="/"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
            >
              Back to Home
            </a>
          </>
        )}
        {status === "failed" && (
          <>
            <h1 className="text-3xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-700 mb-6">We couldn’t verify your order. Please contact support.</p>
            <a
              href="/"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg shadow hover:bg-red-700 transition"
            >
              Back to Home
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
