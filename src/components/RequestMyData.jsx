// 3. RequestMyData.js
import React, { useState } from 'react';
import { getDocs, collection, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const RequestMyData = () => {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState([]);

  const fetchData = async () => {
    const q = query(collection(db, 'orders'), where('customer_email', '==', email));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setOrders(data);
  };

  const deleteData = async () => {
    for (const order of orders) {
      await deleteDoc(doc(db, 'orders', order.id));
    }
    setOrders([]);
    alert('Your data has been deleted.');
  };

  return (
    <div className="p-8 pt-24 max-w-xl mx-auto text-black">
      <h1 className="text-3xl font-bold mb-4">Request My Data</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <button onClick={fetchData} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
        View My Data
      </button>
      {orders.length > 0 && (
        <div>
          <p className="mb-2">Found {orders.length} order(s).</p>
          <button onClick={deleteData} className="bg-red-600 text-white px-4 py-2 rounded">
            Delete My Data
          </button>
        </div>
      )}
    </div>
  );
};

export default RequestMyData;