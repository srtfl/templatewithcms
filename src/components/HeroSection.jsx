
import React from 'react';

const HeroSection = ({ title, subtitle, ctaText, ctaLink }) => (
  <section className="text-center py-20 bg-gray-100">
    <h1 className="text-4xl font-bold mb-4">{title}</h1>
    <p className="text-lg mb-6">{subtitle}</p>
    <a href={ctaLink} className="px-6 py-2 bg-blue-600 text-white rounded-full">{ctaText}</a>
  </section>
);

export default HeroSection;
