import React, { createContext, useContext, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { CartProvider } from "./contexts/CartContext";

// Component imports
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import HeroSection from './components/HeroSection';
import MenuSection from './components/MenuSection';
import OrderOnlineSection from './components/OrderOnlineSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import SuccessPage from './components/SuccessPage';
import CancelPage from './components/CancelPage';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import OrdersPanel from './components/OrdersPanel';
import ProtectedRoute from './components/ProtectedRoute';
import FloatingOrderButton from './components/FloatingOrderButton';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import RequestMyData from './components/RequestMyData';
import GDPRPopup from './components/GDPRPopup'; // ✅ Proper import

// Auth context
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  console.log("Loaded env:", {
    API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
    ALL: process.env
  });  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        setIsAdmin(!!idTokenResult.claims.admin);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin }}>
      <CartProvider>
        <div className="font-inter font-sans bg-gray-900 text-white min-h-screen flex flex-col">
          <Header />
          <ScrollToTop />
          <main className="flex-grow">
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<HeroSection />} />
              <Route path="/menu" element={<MenuSection />} />
              <Route path="/order-online" element={<OrderOnlineSection />} />
              <Route path="/about" element={<AboutSection />} />
              <Route path="/contact" element={<ContactSection />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/cancel" element={<CancelPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/request-my-data" element={<RequestMyData />} />

              {/* Authentication Pages */}
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrdersPanel />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* ✅ GDPR Popup inserted before Footer */}
          <GDPRPopup
            onAccept={() => console.log('Accepted cookies')}
            onReject={() => console.log('Rejected cookies')}
          />

          <FloatingOrderButton />
          <Footer />
        </div>
      </CartProvider>
    </AuthContext.Provider>
  );
}

export default App;
