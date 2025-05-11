import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../Features/home/HeroSection';
import config from '../config/config'; // Corrected path

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch featured products from Firebase
  useEffect(() => {
    const productsCollection = collection(db, 'products');
    const unsubscribe = onSnapshot(
      productsCollection,
      (snapshot) => {
        const liveProducts = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        // Filter for featured products
        const featured = liveProducts.filter((product) => product.featured === true).slice(0, 3);
        setFeaturedProducts(featured);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative inline-block mb-4">
            <h2 className="text-5xl font-extrabold text-black uppercase">
              {config.home.featured.title}
            </h2>
            <div
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 border-t-2 border-[${config.brand.accentColor}] w-1/2`}
            ></div>
          </div>
          <p className={`text-center text-[${config.brand.textColor}] text-sm mb-12`}>
            {config.home.featured.subtitle}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col items-center text-center px-2"
              >
                <div className="w-48 h-48 overflow-hidden mb-6">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = config.images.fallback)}
                  />
                </div>
                <h3 className="text-lg font-bold text-black uppercase mb-3">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 min-h-[60px]">
                  {product.description || 'No description available.'}
                </p>
                <p className="text-sm text-gray-500">
                  {product.calories ? `${product.calories} cal.` : 'N/A cal.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Section */}
      <section className="relative py-16">
        <img
          src={config.home.promo.image}
          alt={config.home.promo.title}
          className="w-full h-[400px] object-cover"
          onError={(e) => (e.target.src = config.home.promo.fallbackImage)}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white uppercase drop-shadow-lg mb-4">
            {config.home.promo.title}
          </h2>
          <p className="text-lg text-white mb-8 max-w-xl">
            {config.home.promo.subtitle}
          </p>
          <button
            onClick={() => navigate('/menu')}
            className={`bg-[${config.brand.themeColor}] hover:bg-[${config.brand.accentColor}] text-black font-bold py-3 px-8 rounded-full shadow-lg transition`}
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Floating Order Now Button */}
      <button
        onClick={() => navigate('/order-online')}
        className={`fixed bottom-4 right-4 bg-[${config.brand.themeColor}] hover:bg-[${config.brand.accentColor}] text-black font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-2 transition`}
      >
        Order Now
      </button>
    </div>
  );
}

export default Home;