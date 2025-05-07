import React, { useState, useEffect } from 'react';
import { savePromotion, getCategories } from '../services/firebaseService';

function PromoModal({ promotion = {}, onDone, onCancel }) {
  const [title, setTitle] = useState(promotion.title || '');
  const [description, setDescription] = useState(promotion.description || '');
  const [category, setCategory] = useState(promotion.category || '');
  const [size, setSize] = useState(promotion.size || 'Regular');
  const [requiredQuantity, setRequiredQuantity] = useState(promotion.requiredQuantity || 2);
  const [regularPromoPrice, setRegularPromoPrice] = useState(promotion.regularPromoPrice || 0);
  const [largePromoPrice, setLargePromoPrice] = useState(promotion.largePromoPrice || 0);
  const [active, setActive] = useState(promotion.active ?? true);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await savePromotion(promotion.id, {
        title,
        description,
        category,
        size,
        requiredQuantity: Number(requiredQuantity),
        regularPromoPrice: Number(regularPromoPrice),
        largePromoPrice: Number(largePromoPrice),
        active,
      });
      onDone();
    } catch (err) {
      console.error('Save promo failed:', err);
      setError('Error saving promotion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm text-white">
      {error && <p className="text-red-500">{error}</p>}

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full px-3 py-2 rounded bg-gray-700"
        required
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full px-3 py-2 rounded bg-gray-700"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full px-3 py-2 rounded bg-gray-700"
        required
      >
        <option value="">Select category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <select
        value={size}
        onChange={(e) => setSize(e.target.value)}
        className="w-full px-3 py-2 rounded bg-gray-700"
      >
        <option value="Regular">Regular</option>
        <option value="Large">Large</option>
      </select>

      <input
        type="number"
        min="1"
        value={requiredQuantity}
        onChange={(e) => setRequiredQuantity(e.target.value)}
        placeholder="Required Quantity"
        className="w-full px-3 py-2 rounded bg-gray-700"
        required
      />

      <input
        type="number"
        min="0"
        value={regularPromoPrice}
        onChange={(e) => setRegularPromoPrice(e.target.value)}
        placeholder="Regular Promo Price"
        className="w-full px-3 py-2 rounded bg-gray-700"
        required
      />

      <input
        type="number"
        min="0"
        value={largePromoPrice}
        onChange={(e) => setLargePromoPrice(e.target.value)}
        placeholder="Large Promo Price"
        className="w-full px-3 py-2 rounded bg-gray-700"
        required
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        Active
      </label>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded text-black font-bold"
        >
          {loading ? 'Saving...' : 'Save Promotion'}
        </button>
      </div>
    </form>
  );
}

export default PromoModal;
