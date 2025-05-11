import React, { useState, useEffect } from 'react';
import { saveProduct, getCategories } from '../services/firebaseService';

function ProductModal({ product = {}, onDone, onCancel }) {
  const [name, setName] = useState(product.name || '');
  const [category, setCategory] = useState(product.category || '');
  const [priceReg, setPriceReg] = useState(product.priceReg || '');
  const [priceLrg, setPriceLrg] = useState(product.priceLrg || '');
  const [image, setImage] = useState(product.image || '');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await saveProduct(product.id, {
        name,
        category,
        priceReg: parseFloat(priceReg),
        priceLrg: parseFloat(priceLrg),
        image,
      });
      onDone();
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm text-white">
      {error && <p className="text-red-500">{error}</p>}

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product Name"
        className="w-full px-3 py-2 rounded bg-gray-700"
        required
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

      <div className="flex gap-4">
        <input
          value={priceReg}
          type="number"
          step="0.01"
          onChange={(e) => setPriceReg(e.target.value)}
          placeholder="Regular Price"
          className="flex-1 px-3 py-2 rounded bg-gray-700"
          required
        />
        <input
          value={priceLrg}
          type="number"
          step="0.01"
          onChange={(e) => setPriceLrg(e.target.value)}
          placeholder="Large Price"
          className="flex-1 px-3 py-2 rounded bg-gray-700"
          required
        />
      </div>

      <input
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="Image URL"
        className="w-full px-3 py-2 rounded bg-gray-700"
      />

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
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export default ProductModal;
