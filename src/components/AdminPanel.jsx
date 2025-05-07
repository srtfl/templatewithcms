import React, { useEffect, useState } from 'react';
import {
  getProducts,
  deleteProduct,
  getPromotions,
  deletePromotion,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from '../services/firebaseService';
import ProductForm from './ProductForm';
import PromotionForm from './PromotionForm';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom'; // Add this import

// Initialize Stripe with your test publishable key
const stripePromise = loadStripe('pk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

// Use a base64 placeholder image to avoid file import
const placeholderImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB0SURBVHhe3c0BDQAAAMKg9U9tCy8aAADgT+2BAACgABAAAgAAIAABAAAgAAQAASAABAAAgAAIAAAgAAQAASAABAAAgAAIAAAgAAQAASAABAAAgAAIAAAgAAQAASAABAAAgAAIAACAQ78BASm1PbgAAAAASUVORK5CYII=';

function TestPaymentForm({ onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const testAmount = 10.00;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: testAmount, metadata: { testPayment: true } }),
      });
      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else if (result.paymentIntent.status === 'succeeded') {
        onSuccess(result.paymentIntent);
      }
    } catch (err) {
      setError('Payment test failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <CardElement className="border rounded p-3 bg-gray-100" />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
      >
        {processing ? 'Processing...' : `Test Payment £${testAmount.toFixed(2)}`}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="block w-full text-sm text-gray-500 hover:text-gray-700 mt-2"
      >
        Cancel
      </button>
    </form>
  );
}

// Simple CategoryForm component
function CategoryForm({ category, onDone, onCancel }) {
  const [value, setValue] = useState(category?.value || '');
  const [displayName, setDisplayName] = useState(category?.displayName || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryData = { value, displayName };
    if (category?.id) {
      await updateCategory(category.id, categoryData);
    } else {
      await addCategory(categoryData);
    }
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <div>
        <label className="block text-sm font-medium mb-1">Value</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g., milk-teas"
          className="w-full p-2 border rounded bg-gray-700 text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Display Name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g., Milk Teas"
          className="w-full p-2 border rounded bg-gray-700 text-white"
          required
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
          {category?.id ? 'Update' : 'Add'} Category
        </button>
      </div>
    </form>
  );
}

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [selectedProductCategory, setSelectedProductCategory] = useState('All');
  const [selectedPromoCategory, setSelectedPromoCategory] = useState('All');
  const [productCategories, setProductCategories] = useState(['All']);
  const [promoCategories, setPromoCategories] = useState(['All']);
  const [showTestPayment, setShowTestPayment] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState(null);
  const [failedImages, setFailedImages] = useState(new Set());
  const navigate = useNavigate(); // Add useNavigate hook

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingCategories(true);
        const productData = await getProducts();
        const promoData = await getPromotions();
        const categoryData = await getCategories();

        console.log('Fetched categories:', categoryData);
        if (categoryData.length === 0) {
          setCategoryError('No categories found in Firestore. Please run populateCategories.js.');
        }

        const uniqueProducts = Array.from(
          new Map(productData.map(p => [p.name.trim().toLowerCase(), p])).values()
        );

        const uniquePromotions = Array.from(
          new Map(
            promoData.map(p => [`${p.category.trim().toLowerCase()}-${p.size.trim().toLowerCase()}`, p])
          ).values()
        );

        setProducts(uniqueProducts);
        setPromotions(uniquePromotions);
        setCategories(categoryData);

        const categoryValues = categoryData
          .filter(cat => cat && cat.value)
          .map(cat => cat.value);
        setProductCategories(['All', ...categoryValues]);
        setPromoCategories(['All', ...categoryValues]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setCategoryError('Failed to load categories. Please check your Firestore configuration.');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchData();
  }, [refresh]);

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      setRefresh(!refresh);
    }
  };

  const handleDeletePromotion = async (id) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      await deletePromotion(id);
      setRefresh(!refresh);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(id);
      setRefresh(!refresh);
    }
  };

  const handleImageError = (imageUrl, e) => {
    if (!failedImages.has(imageUrl)) {
      setFailedImages(prev => new Set(prev).add(imageUrl));
      e.target.src = placeholderImage;
    }
  };

  const filteredProducts = selectedProductCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedProductCategory);

  const filteredPromotions = selectedPromoCategory === 'All'
    ? promotions
    : promotions.filter((p) => p.category === selectedPromoCategory);

  return (
    <div className="min-h-screen bg-white text-black p-8 pt-20">
      <div className="flex justify-end mb-6 space-x-4">
        <button
          onClick={() => setShowTestPayment(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Payment
        </button>
        <button
        onClick={() => {
          console.log('View & Manage Orders clicked, navigating to /orders');
          navigate('/orders');
        }}
          
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          View & Manage Orders
        </button>

        {/* Temporary test button */}
        <button
          onClick={() => {
            console.log('Test button clicked, navigating to /menu');
            navigate('/menu');
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Test Navigate to Menu
        </button>
      </div>

      <section className="mb-12">
        <div className="relative text-center mb-8">
          <h2 className="text-5xl font-extrabold text-black uppercase mb-2">
            Manage Categories
          </h2>
          <div className="w-24 h-1 bg-coco-orange mx-auto rounded-full"></div>
        </div>

        <div className="sticky top-16 z-30 bg-white py-4 shadow-md flex justify-center flex-wrap gap-2 mb-12">
          {loadingCategories ? (
            <p>Loading categories...</p>
          ) : categoryError ? (
            <p className="text-red-500">{categoryError}</p>
          ) : (
            productCategories.map((category) => (
              <button
                key={category || 'unknown'}
                onClick={() => setSelectedProductCategory(category)}
                className={`py-1 px-4 rounded-full font-semibold text-sm transition-colors duration-200
                  ${selectedProductCategory === category
                    ? 'bg-coco-yellow text-black shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {category?.toLowerCase() || 'Unknown'}
              </button>
            ))
          )}
        </div>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => setEditingCategory({})}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            + Add Category
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="border rounded-xl p-4 flex flex-col items-center text-center shadow hover:shadow-lg transition duration-300 bg-white"
            >
              <h3 className="text-md font-semibold text-black capitalize mb-1">
                {category.displayName}
              </h3>
              <p className="text-sm text-gray-700">Value: {category.value}</p>
              <div className="flex justify-between w-full mt-4">
                <button
                  onClick={() => setEditingCategory(category)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="relative text-center mb-8">
          <h2 className="text-5xl font-extrabold text-black uppercase mb-2">
            Manage Products
          </h2>
          <div className="w-24 h-1 bg-coco-orange mx-auto rounded-full"></div>
        </div>

        <div className="sticky top-16 z-30 bg-white py-4 shadow-md flex justify-center flex-wrap gap-2 mb-12">
          {loadingCategories ? (
            <p>Loading categories...</p>
          ) : categoryError ? (
            <p className="text-red-500">{categoryError}</p>
          ) : (
            productCategories.map((category) => (
              <button
                key={category || 'unknown'}
                onClick={() => setSelectedProductCategory(category)}
                className={`py-1 px-4 rounded-full font-semibold text-sm transition-colors duration-200
                  ${selectedProductCategory === category
                    ? 'bg-coco-yellow text-black shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {category?.toLowerCase() || 'Unknown'}
              </button>
            ))
          )}
        </div>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => setEditingProduct({})}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            + Add Product
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-xl p-4 flex flex-col items-center text-center shadow hover:shadow-lg transition duration-300 bg-white"
            >
              <div className="w-32 h-32 mb-4 overflow-hidden rounded-md">
                <img
                  src={failedImages.has(product.image) ? placeholderImage : product.image || placeholderImage}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                  onError={(e) => handleImageError(product.image, e)}
                />
              </div>
              <h3 className="text-md font-semibold text-black capitalize mb-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-700 capitalize">{product.category}</p>
              <p className="text-sm text-gray-600">REG: £{product.priceReg?.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mb-4">LRG: £{product.priceLrg?.toFixed(2)}</p>
              <div className="flex justify-between w-full">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="relative text-center mb-8">
          <h2 className="text-5xl font-extrabold text-black uppercase mb-2">
            Manage Promotions
          </h2>
          <div className="w-24 h-1 bg-coco-orange mx-auto rounded-full"></div>
        </div>

        <div className="sticky top-16 z-30 bg-white py-4 shadow-md flex justify-center flex-wrap gap-2 mb-12">
          {loadingCategories ? (
            <p>Loading categories...</p>
          ) : categoryError ? (
            <p className="text-red-500">{categoryError}</p>
          ) : (
            promoCategories.map((category) => (
              <button
                key={category || 'unknown'}
                onClick={() => setSelectedPromoCategory(category)}
                className={`py-1 px-4 rounded-full font-semibold text-sm transition-colors duration-200
                  ${selectedPromoCategory === category
                    ? 'bg-coco-yellow text-black shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {category?.toLowerCase() || 'Unknown'}
              </button>
            ))
          )}
        </div>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => setEditingPromotion({})}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            + Add Promotion
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPromotions.map((promo) => (
            <div
              key={promo.id}
              className="border rounded-xl p-4 flex flex-col items-center text-center shadow hover:shadow-lg transition duration-300 bg-white"
            >
              <h3 className="text-md font-semibold text-black capitalize mb-1">
                {promo.category} - {promo.size?.toUpperCase()}
              </h3>
              <p className="text-sm text-gray-600">
                Buy {promo.requiredQuantity} for £
                {(promo.size === 'reg' ? promo.priceReg : promo.priceLrg)?.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Active: {promo.active ? 'Yes' : 'No'}
              </p>
              <div className="flex justify-between w-full">
                <button
                  onClick={() => setEditingPromotion(promo)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePromotion(promo.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct.id ? 'Edit Product' : 'Add Product'}
            </h2>
            <ProductForm
              product={editingProduct}
              onDone={() => {
                setEditingProduct(null);
                setRefresh(!refresh);
              }}
              onCancel={() => setEditingProduct(null)}
            />
          </div>
        </div>
      )}

      {editingPromotion && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingPromotion.id ? 'Edit Promotion' : 'Add Promotion'}
            </h2>
            <PromotionForm
              promotion={editingPromotion}
              onDone={() => {
                setEditingPromotion(null);
                setRefresh(!refresh);
              }}
              onCancel={() => setEditingPromotion(null)}
            />
          </div>
        </div>
      )}

      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory.id ? 'Edit Category' : 'Add Category'}
            </h2>
            <CategoryForm
              category={editingCategory}
              onDone={() => {
                setEditingCategory(null);
                setRefresh(!refresh);
              }}
              onCancel={() => setEditingCategory(null)}
            />
          </div>
        </div>
      )}

      {showTestPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-black">Test Payment</h2>
            <Elements stripe={stripePromise}>
              <TestPaymentForm
                onSuccess={(paymentIntent) => {
                  alert('Test payment successful! Payment ID: ' + paymentIntent.id);
                  setShowTestPayment(false);
                }}
                onCancel={() => setShowTestPayment(false)}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;