import React, { useState, useEffect } from 'react';
import { getCategories, savePromotion } from '../services/firebaseService';

function PromotionForm({ promotion, onDone, onCancel }) {
  const [title, setTitle] = useState(promotion?.title || '');
  const [description, setDescription] = useState(promotion?.description || '');
  const [category, setCategory] = useState(promotion?.category || '');
  const [size, setSize] = useState(promotion?.size || 'reg');
  const [requiredQuantity, setRequiredQuantity] = useState(promotion?.requiredQuantity || 1);
  const [priceReg, setPriceReg] = useState(promotion?.priceReg || 0);
  const [priceLrg, setPriceLrg] = useState(promotion?.priceLrg || 0);
  const [active, setActive] = useState(promotion?.active ?? true);
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
      const promotionData = {
        id: promotion?.id, // Include ID if editing
        title,
        description,
        category,
        size,
        requiredQuantity: parseInt(requiredQuantity),
        priceReg: parseFloat(priceReg),
        priceLrg: parseFloat(priceLrg),
        active,
      };
      await savePromotion(promotionData);
      onDone();
    } catch (err) {
      console.error('Error saving promotion:', err);
      setError('Failed to save promotion. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded bg-gray-700 text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
      <div>
        <label className="block text-sm font-medium mb-1">Size</label>
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-full p-2 border rounded bg-gray-700 text-white"
          required
        >
          <option value="reg">Regular</option>
          <option value="lrg">Large</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Required Quantity</label>
        <input
          type="number"
          value={requiredQuantity}
          onChange={(e) => setRequiredQuantity(e.target.value)}
          className="w-full p-2 border rounded bg-gray-700 text-white"
          min="1"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Regular Promo Price (£)</label>
        <input
          type="number"
          step="0.01"
          value={priceReg}
          onChange={(e) => setPriceReg(e.target.value)}
          className="w-full p-2 border rounded bg-gray-700 text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Large Promo Price (£)</label>
        <input
          type="number"
          step="0.01"
          value={priceLrg}
          onChange={(e) => setPriceLrg(e.target.value)}
          className="w-full p-2 border rounded bg-gray-700 text-white"
          required
        />
      </div>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="form-checkbox"
        />
        <span>Active</span>
      </label>
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
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded"
        >
          Save Promotion
        </button>
      </div>
    </form>
  );
}

export default PromotionForm;