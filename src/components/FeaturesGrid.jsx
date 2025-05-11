
import React from 'react';

const FeaturesGrid = ({ features }) => (
  <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-10">
    {features.map((feature, idx) => (
      <div key={idx} className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
        <p>{feature.description}</p>
      </div>
    ))}
  </section>
);

export default FeaturesGrid;
