import React, { useState, useEffect } from 'react';
import { getCategories, saveProduct } from '../services/firebaseService';

function ProductForm({ product, onDone, onCancel }) {
  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(product?.category || '');
  const [priceReg, setPriceReg] = useState(product?.priceReg || 0);
  const [priceLrg, setPriceLrg] = useState(product?.priceLrg || 0);
  const [image, setImage] = useState(product?.image || '');
  const [calories, setCalories] = useState(product?.calories || '');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await getCategories();
        setCategories(categoryData.map(cat => cat.value));
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories.');
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        id: product?.id, // Include ID if editing
        name,
        category,
        priceReg: parseFloat(priceReg),
        priceLrg: parseFloat(priceLrg),
        image,
        calories: calories ? parseInt(calories) : null,
      };
      await saveProduct(productData);
      onDone();
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Failed to save product. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block text-sm font-medium mb-1">Product Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded bg-gray-700 text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded bg-gray-700 text-white"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Regular Price (£)</label>
          <input
            type="number"
            step="0.01"
            value={priceReg}
            onChange={(e) => setPriceReg(e.target.value)}
            className="w-full p-2 border rounded bg-gray-700 text-white"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Large Price (£)</label>
          <input
            type="number"
            step="0.01"
            value={priceLrg}
            onChange={(e) => setPriceLrg(e.target.value)}
            className="w-full p-2 border rounded bg-gray-700 text-white"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full p-2 border rounded bg-gray-700 text-white"
        />
      </div>
      {image && (
        <div className="flex justify-center">
          <img
            src={image}
            alt="Product Preview"
            className="w-32 h-32 object-contain rounded"
            onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1">Calories (optional)</label>
        <input
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          className="w-full p-2 border rounded bg-gray-700 text-white"
        />
      </div>
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default ProductForm;