import React from 'react';
import { Link } from 'react-router-dom';

function FeaturedDrinks() {
  const drinks = [
    {
      name: 'Classic Milk Tea',
      image: '/images/classic-milk-tea.jpg',
      description: 'A timeless blend of black tea, milk, and chewy tapioca pearls.',
    },
    {
      name: 'Mango Passionfruit',
      image: '/images/mango-passionfruit.jpg',
      description: 'A tropical burst of mango and passionfruit with a refreshing finish.',
    },
    {
      name: 'Strawberry Milkshake',
      image: '/images/strawberry-milkshake.jpg',
      description: 'Creamy strawberry milkshake topped with whipped cream.',
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2
          className="text-4xl font-semibold text-gray-800 mb-8 capitalize"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Featured Drinks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {drinks.map((drink, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={drink.image}
                alt={drink.name}
                className="w-full h-48 object-cover"
                onError={(e) => (e.target.src = 'https://placehold.co/300x200?text=Drink+Image')}
              />
              <div className="p-6">
                <h3
                  className="text-xl font-semibold text-gray-800 mb-2"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {drink.name}
                </h3>
                <p
                  className="text-gray-600 mb-4"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {drink.description}
                </p>
                <Link
                  to="/menu"
                  className="bg-coco-orange hover:bg-coco-yellow text-white font-semibold py-2 px-4 rounded-full transition-colors"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Order Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedDrinks;