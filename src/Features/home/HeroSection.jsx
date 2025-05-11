import React from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config/config';

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      className="relative w-full h-[600px] bg-cover bg-center flex flex-col justify-center items-center text-white"
      style={{
        backgroundImage: `url('${config.home.hero.image}')`,
      }}
      onError={(e) => {
        e.target.style.backgroundImage = `url('${config.home.hero.fallbackImage}')`;
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Main Hero Content */}
      <div className="relative text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg uppercase">
          {config.home.hero.title}
        </h1>
        <p className="text-xl mb-8 drop-shadow-md max-w-2xl">
          {config.home.hero.subtitle}
        </p>
        <button
          onClick={() => navigate('/menu')}
          className={`bg-[${config.brand.themeColor}] hover:bg-[${config.brand.accentColor}] text-black font-bold py-3 px-8 rounded-full shadow-lg transition-colors`}
        >
          Order Now
        </button>
      </div>
    </section>
  );
}

export default HeroSection;