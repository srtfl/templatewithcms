import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import OrderCard from './OrderCard';

function OrdersPanel() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortOption, setSortOption] = useState('newest');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  useEffect(() => {
    if (!user || !isAdmin) return;

    const ordersCollection = collection(db, 'orders');
    const unsubscribe = onSnapshot(
      ordersCollection,
      (snapshot) => {
        const fetchedOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(fetchedOrders);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching orders:', err);
        setError('Error fetching orders. Please try again later.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, isAdmin]);

  const sortOrders = (orders) => {
    const sorted = [...orders];
    switch (sortOption) {
      case 'newest':
        sorted.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
        break;
      case 'oldest':
        sorted.sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds);
        break;
      case 'highest':
        sorted.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case 'lowest':
        sorted.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
      default:
        break;
    }
    return sorted;
  };

  const filterOrders = (orders) => {
    if (filterStatus === 'all') return orders;
    return orders.filter((order) => order.status === filterStatus);
  };

  const searchOrders = (orders) => {
    const term = searchTerm.toLowerCase();
    return orders.filter((order) =>
      (order.customer_email?.toLowerCase() || '').includes(term) ||
      (order.customer_name?.toLowerCase() || '').includes(term)
    );
  };

  const processedOrders = sortOrders(
    searchOrders(
      filterOrders(orders)
    )
  );

  if (loading) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl">Loading Orders...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        <h1 className="text-2xl">Error: {error}</h1>
      </div>
    );
  }

  return (
    <div className="p-8 pt-24 bg-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-black">Orders Dashboard</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        {/* Sort Dropdown */}
        <div>
          <label className="text-gray-700 mr-2 font-medium">Sort by:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-black bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Total</option>
            <option value="lowest">Lowest Total</option>
          </select>
        </div>

        {/* Filter Dropdown */}
        <div>
          <label className="text-gray-700 mr-2 font-medium">Filter:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-black bg-white"
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Search Input */}
        <div>
          <input
            type="text"
            placeholder="Search by email or name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 w-64 text-black bg-white"
          />
        </div>
      </div>

      {processedOrders.length === 0 ? (
        <p className="text-gray-700">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {processedOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPanel;
