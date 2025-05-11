// src/components/CategoryForm.jsx
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

function CategoryForm({ onDone }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'categories'), { name });
      setName('');
      if (onDone) onDone();
    } catch (err) {
      console.error('Error adding category:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddCategory} className="space-y-4">
      <label className="block text-sm font-bold">New Category Name</label>
      <input
        type="text"
        required
        className="w-full p-2 rounded bg-gray-100"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-coco-yellow hover:bg-coco-orange px-4 py-2 rounded font-bold text-black"
      >
        {loading ? 'Adding...' : 'Add Category'}
      </button>
    </form>
  );
}

export default CategoryForm;
        