import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import config from '../config';

function About() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 800, once: true });
  }, [location]);

  return (
    <div className="pt-24 bg-gray-50 min-h-screen font-poppins">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-96 flex items-center justify-center"
        style={{
          backgroundImage: `url('${config.about.hero.image}')`,
        }}
        onError={(e) => {
          e.target.style.backgroundImage = `url('${config.about.hero.fallbackImage}')`;
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold uppercase mb-4" data-aos="fade-up">
            {config.about.hero.title}
          </h1>
          <p className="text-lg max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            {config.about.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 className="text-4xl font-semibold text-gray-800 mb-6 capitalize">
              {config.about.story.title}
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              {config.about.story.content}
            </p>
          </div>
          <div className="relative" data-aos="fade-left">
            <img
              src={config.images.about}
              alt={config.about.story.title}
              className="rounded-lg shadow-lg w-full h-80 object-cover"
              onError={(e) => (e.target.src = config.images.fallback)}
            />
            {config.about.story.caption && (
              <div
                className={`absolute -bottom-4 left-4 bg-white text-[${config.brand.accentColor}] border border-[${config.brand.accentColor}] font-semibold py-2 px-4 rounded-full shadow`}
                data-aos="fade-up"
              >
                {config.about.story.caption}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-semibold text-gray-800 mb-6 capitalize" data-aos="fade-up">
            {config.about.mission.title}
          </h2>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed" data-aos="fade-up" data-aos-delay="100">
            {config.about.mission.content}
          </p>

          {/* Features Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12" data-aos="fade-up" data-aos-delay="200">
            {config.about.mission.features.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-4xl mb-2">{item.icon}</div>
                <p className="font-medium text-gray-700">{item.label}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="mt-10" data-aos="fade-up" data-aos-delay="300">
            <a
              href="/menu"
              className={`bg-[${config.brand.accentColor}] hover:bg-[${config.brand.themeColor}] text-white font-semibold py-3 px-6 rounded-full transition-colors`}
            >
              Explore Our Menu
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;