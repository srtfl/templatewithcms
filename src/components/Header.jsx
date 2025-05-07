import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../App';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { FaShoppingCart, FaBars, FaTimes, FaUser } from 'react-icons/fa';
import config from '../config';

function Header() {
  const { cartItems } = useCart();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { logo, name, themeColor, textColor, accentColor } = config.brand;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 shadow-md transition-all duration-300 ${
        isScrolled ? 'py-2 shadow-lg' : 'py-4'
      }`}
      style={{ backgroundColor: themeColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" aria-label="Home">
              <img
                src={logo}
                alt={name}
                className="h-12 w-auto transition-transform duration-300 hover:scale-105"
                onError={(e) => (e.target.src = config.images.fallback)}
              />
            </Link>
            <span
              className={`text-sm font-semibold hidden sm:block`}
              style={{ color: textColor, fontFamily: 'Poppins, sans-serif' }}
            >
              {name}
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {config.navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-[${textColor}] hover:text-[${accentColor}] font-medium transition-colors`}
              >
                {item.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`text-[${textColor}] hover:text-[${accentColor}] font-medium transition-colors`}
              >
                Admin
              </Link>
            )}

            <div
              onClick={() => navigate('/order-online')}
              className={`relative text-[${textColor}] hover:text-[${accentColor}] transition-transform duration-300 hover:scale-110 cursor-pointer`}
              aria-label={`View basket with ${totalItems} items`}
            >
              <FaShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span
                  className={`absolute -top-2 -right-2 bg-[${accentColor}] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow`}
                >
                  {totalItems}
                </span>
              )}
            </div>

            {user ? (
              <button
                onClick={handleLogout}
                className={`flex items-center text-[${textColor}] hover:text-[${accentColor}] font-medium transition-colors`}
              >
                <FaUser className="mr-2 h-5 w-5" />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className={`flex items-center text-[${textColor}] hover:text-[${accentColor}] font-medium transition-colors`}
              >
                <FaUser className="mr-2 h-5 w-5" />
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`text-[${textColor}] hover:text-[${accentColor}]`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <nav
            className="md:hidden mt-4 rounded-b-lg shadow-lg animate-slide-down"
            style={{ backgroundColor: themeColor }}
          >
            <div className="flex flex-col space-y-2 p-4">
              {config.navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-[${textColor}] hover:text-[${accentColor}] font-medium px-4 py-2 rounded-md transition`}
                >
                  {item.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-[${textColor}] hover:text-[${accentColor}] font-medium px-4 py-2 rounded-md transition`}
                >
                  Admin
                </Link>
              )}

              <button
                onClick={() => {
                  navigate('/order-online');
                  setIsMenuOpen(false);
                }}
                className={`flex items-center text-[${textColor}] hover:text-[${accentColor}] px-4 py-2 rounded-md transition`}
              >
                <FaShoppingCart className="h-6 w-6 mr-2" />
                Basket
                {totalItems > 0 && (
                  <span
                    className={`ml-2 bg-[${accentColor}] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow`}
                  >
                    {totalItems}
                  </span>
                )}
              </button>

              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center text-[${textColor}] hover:text-[${accentColor}] px-4 py-2 transition`}
                >
                  <FaUser className="h-6 w-6 mr-2" />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center text-[${textColor}] hover:text-[${accentColor}] px-4 py-2 transition`}
                >
                  <FaUser className="h-6 w-6 mr-2" />
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;