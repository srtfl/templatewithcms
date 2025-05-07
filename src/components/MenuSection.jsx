import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUndo } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getCategories } from '../services/firebaseService';

// Initialize Stripe with your test publishable key
const stripePromise = loadStripe('pk_test_51RJdtSFZmDqqR2xX7akXUxT2lS7ySehkgy9zc79wXAs84sQbHX0q3kzAXkUqBqhbuh8FwnEbLWIG18K1FnXpKvGq00alUzv5o2');

const placeholderImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB0SURBVHhe3c0BDQAAAMKg9U9tCy8aAADgT+2BAACgABAAAgAAIAABAAAgAAQAASAABAAAgAAIAAAgAAQAASAABAAAgAAIAAAgAAQAASAABAAAgAAIAAAgAAQAASAABAAAgAAIAACAQ78BASm1PbgAAAAASUVORK5CYII=';

function CheckoutForm({ totalAmount, cartItems, onSuccess, onCancel, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [error, setError] = useState(null);
  const [cancelled, setCancelled] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);
    setSuccess(false);
    setCancelled(false);

    if (!stripe || !elements) {
      setError('Stripe has not loaded. Please try again.');
      setProcessing(false);
      return;
    }

    // Use environment variable or fallback to local URL
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
    const apiEndpoint = `${backendUrl}/api/create-payment-intent`;

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount, metadata: { cartItems: JSON.stringify(cartItems) } }),
      });

      const data = await response.json();
      console.log('Payment Intent Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      const { clientSecret } = data;

      if (!clientSecret) {
        throw new Error('No client secret returned from server');
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
        return_url: undefined,
      });

      if (result.error) {
        if (result.error.code === 'payment_intent_authentication_failure' || result.error.message.includes('cancel')) {
          setCancelled(true);
        } else {
          setError(result.error.message);
        }
        setProcessing(false);
      } else if (result.paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', result.paymentIntent);
        setSuccess(true);
        setPaymentId(result.paymentIntent.id);
        setProcessing(false);
        clearCart();
        onSuccess(result.paymentIntent);
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  const handleBackToMenu = () => {
    if (success) {
      navigate('/order-confirmation');
    } else {
      onClose();
      navigate('/');
    }
  };

  const handleReturnToCheckout = () => {
    onClose();
    navigate('/order-online');
  };

  return (
    <div className="space-y-4">
      {!success && !error && !cancelled && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <CardElement className="border rounded p-3 bg-gray-100" />
          <button
            type="submit"
            disabled={!stripe || processing}
            className="w-full bg-coco-yellow hover:bg-coco-orange text-black font-bold py-2 rounded-full"
          >
            {processing ? 'Processing...' : `Pay £${totalAmount.toFixed(2)}`}
          </button>
          <button
            type="button"
            onClick={() => {
              onCancel();
              navigate('/');
            }}
            className="block w-full text-sm text-gray-500 hover:text-gray-700 mt-2"
          >
            Continue Shopping
          </button>
        </form>
      )}

      {success && (
        <div className="text-center">
          <h3 className="text-lg font-bold text-green-600 mb-2">Payment Successful!</h3>
          <p className="text-sm text-gray-600 mb-4">
            Payment ID: {paymentId}
          </p>
          <button
            onClick={handleBackToMenu}
            className="w-full bg-coco-yellow hover:bg-coco-orange text-black font-bold py-2 rounded-full"
          >
            Back to Menu
          </button>
        </div>
      )}

      {error && (
        <div className="text-center">
          <h3 className="text-lg font-bold text-red-600 mb-2">Payment Failed</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleBackToMenu}
            className="w-full bg-coco-yellow hover:bg-coco-orange text-black font-bold py-2 rounded-full"
          >
            Back to Menu
          </button>
        </div>
      )}

      {cancelled && (
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-bold text-black mb-2">Payment Cancelled</h3>
          <p className="text-sm text-gray-600 mb-4">
            Your payment was not completed. Please try again.
          </p>
          <button
            onClick={handleReturnToCheckout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-full"
          >
            Return to Checkout
          </button>
        </div>
      )}
    </div>
  );
}

function MenuSection() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [modalProduct, setModalProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('reg');
  const [quantity, setQuantity] = useState(1);
  const [selectedItems, setSelectedItems] = useState({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState(null);
  const [failedImages, setFailedImages] = useState(new Set());

  const { cartItems, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const syncSelectedItemsWithCart = () => {
      const newSelectedItems = {};

      (cartItems || []).forEach((item) => {
        const productId = item.id;
        if (!newSelectedItems[productId]) {
          newSelectedItems[productId] = [];
        }

        const existingSelection = newSelectedItems[productId].find(
          (selection) => selection.size === item.size
        );

        if (existingSelection) {
          existingSelection.quantity += item.quantity;
        } else {
          newSelectedItems[productId].push({
            size: item.size,
            price: item.price,
            quantity: item.quantity,
          });
        }
      });

      setSelectedItems(newSelectedItems);
      console.log('Updated selectedItems:', newSelectedItems);
    };

    syncSelectedItemsWithCart();
  }, [cartItems]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoryData = await getCategories();
        console.log('Fetched categories:', categoryData);
        if (categoryData.length === 0) {
          setCategoryError('No categories found in Firestore. Please run populateCategories.js.');
        }
        const categoryValues = categoryData
          .filter(cat => cat && cat.value)
          .map(cat => cat.value);
        setCategories(['All', ...categoryValues]);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setCategoryError('Failed to load categories. Please check your Firestore configuration.');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();

    const productsCollection = collection(db, 'products');
    const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
      const liveProducts = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const uniqueProducts = Array.from(
        new Map(liveProducts.map(p => [p.name.trim().toLowerCase(), p])).values()
      );

      setProducts(uniqueProducts);
    }, (error) => {
      console.error('Error fetching products:', error);
    });

    return () => unsubscribe();
  }, []);

  const handleImageError = (imageUrl, e) => {
    if (!failedImages.has(imageUrl)) {
      setFailedImages(prev => new Set(prev).add(imageUrl));
      e.target.src = placeholderImage;
    }
  };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const handleAddToCartClick = (product, size) => {
    setModalProduct(product);
    setSelectedSize(size);
    setQuantity(1);
  };

  const handleConfirmAdd = () => {
    if (modalProduct) {
      const itemToAdd = {
        id: modalProduct.id,
        name: modalProduct.name,
        size: selectedSize,
        price: selectedSize === 'reg' ? modalProduct.priceReg : modalProduct.priceLrg,
        quantity,
        category: modalProduct.category,
      };
      addToCart(itemToAdd);

      setModalProduct(null);
    }
  };

  const handleResetSelections = (productId) => {
    removeFromCart({ id: productId });
    setSelectedItems((prev) => {
      const newSelectedItems = { ...prev };
      delete newSelectedItems[productId];
      return newSelectedItems;
    });
  };

  const handleOrderNow = () => {
    const cartItemsLocal = cartItems || [];
    if (cartItemsLocal.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setShowCheckout(true);
  };

  const calculateTotal = () => {
    const cartItemsLocal = cartItems || [];
    return cartItemsLocal.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <section id="menu" className="pt-32 py-16 bg-white relative">
      <div className="max-w-[1280px] mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative text-center mb-8">
          <h2 className="text-5xl font-extrabold text-black uppercase mb-2">
            Our Menu
          </h2>
          <div className="w-24 h-1 bg-coco-orange mx-auto rounded-full"></div>
          <p className="text-coco-gray text-sm mt-4">
            This product catalog represents all potential items served in store. Availability may vary by location.
          </p>
        </div>

        <div className="sticky top-16 z-30 bg-white py-4 shadow-md flex justify-center flex-wrap gap-2 mb-12">
          {loadingCategories ? (
            <p>Loading categories...</p>
          ) : categoryError ? (
            <p className="text-red-500">{categoryError}</p>
          ) : (
            categories.map((category) => (
              <button
                key={category || 'unknown'}
                onClick={() => setSelectedCategory(category)}
                className={`py-1 px-4 rounded-full font-semibold text-sm transition-colors duration-200
                  ${selectedCategory === category
                    ? 'bg-coco-yellow text-black shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {category?.toLowerCase() || 'Unknown'}
              </button>
            ))
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const selections = selectedItems[product.id] || [];
            const totalQuantity = selections.reduce((sum, item) => sum + item.quantity, 0);

            return (
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

                <div className="flex flex-col items-center text-sm text-gray-700 gap-1 mb-2">
                  <div className="flex items-center justify-between gap-2">
                    <span>REG £{product.priceReg.toFixed(2)}</span>
                    <button
                      onClick={() => handleAddToCartClick(product, 'reg')}
                      className="text-coco-yellow hover:text-coco-orange transition-transform hover:scale-110"
                      title="Add REG to basket"
                    >
                      <FaShoppingCart size={18} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span>LRG £{product.priceLrg.toFixed(2)}</span>
                    <button
                      onClick={() => handleAddToCartClick(product, 'lrg')}
                      className="text-coco-yellow hover:text-coco-orange transition-transform hover:scale-110"
                      title="Add LRG to basket"
                    >
                      <FaShoppingCart size={18} />
                    </button>
                  </div>
                </div>

                {totalQuantity > 0 && (
                  <div className="text-xs text-gray-600 mb-2">
                    {selections.map((item, index) => (
                      <div key={index}>
                        <p>Size: {item.size === 'reg' ? 'Regular' : 'Large'}</p>
                        <p>Price: £{item.price.toFixed(2)}</p>
                        <p>Qty: {item.quantity}</p>
                      </div>
                    ))}
                    <p className="font-semibold">Total Qty: {totalQuantity}</p>
                    <button
                      onClick={() => handleResetSelections(product.id)}
                      className="text-red-500 text-xs hover:text-red-700 mt-1 flex items-center"
                    >
                      <FaUndo size={12} className="mr-1" /> Reset
                    </button>
                  </div>
                )}

                <p className="text-xs text-gray-400">
                  {product.calories ? `${product.calories} cal.` : 'N/A cal.'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleOrderNow}
        className="fixed bottom-4 right-4 bg-coco-yellow hover:bg-coco-orange text-black font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-2 transition"
      >
        Order Now
      </button>

      {modalProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl animate-fade-in">
            <h2 className="text-xl font-bold mb-4 text-black">{modalProduct.name}</h2>

            <div className="flex justify-center items-center mb-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded-full"
              >
                -
              </button>
              <span className="w-12 h-12 flex items-center justify-center text-xl font-semibold text-black bg-white border border-gray-300 rounded-full shadow-sm">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded-full"
              >
                +
              </button>
            </div>

            <button
              onClick={handleConfirmAdd}
              className="w-full bg-coco-yellow hover:bg-coco-orange text-black font-bold py-2 rounded-full mb-3"
            >
              Add {quantity} to Basket
            </button>

            <button
              onClick={() => setModalProduct(null)}
              className="block w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl animate-fade-in">
            <h2 className="text-xl font-bold mb-4 text-black">Checkout</h2>
            <p className="mb-4">Total: £{calculateTotal().toFixed(2)}</p>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                totalAmount={calculateTotal()}
                cartItems={cartItems}
                onSuccess={() => {
                  console.log('Payment successful callback');
                }}
                onCancel={() => {
                  setShowCheckout(false);
                }}
                onClose={() => setShowCheckout(false)}
              />
            </Elements>
          </div>
        </div>
      )}
    </section>
  );
}

export default MenuSection;