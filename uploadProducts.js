const admin = require('firebase-admin');
const fs = require('fs');

// Load Firebase Admin credentials
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Load products from JSON file
const products = JSON.parse(fs.readFileSync('./public/data/products.json', 'utf-8'));

// Validate each product
const isValidProduct = (product) => {
  const requiredFields = ['name', 'category', 'priceReg', 'priceLrg', 'image'];
  return requiredFields.every((field) => product[field] !== undefined && product[field] !== '');
};

async function uploadProducts() {
  const batch = db.batch();
  const collectionRef = db.collection('products');

  products.forEach((product) => {
    if (isValidProduct(product)) {
      const newDocRef = collectionRef.doc(); // Auto-generate ID
      batch.set(newDocRef, product);
    } else {
      console.error('❌ Skipping invalid product:', product);
    }
  });

  await batch.commit();
  console.log('✅ All valid products uploaded successfully!');
}

uploadProducts().catch((error) => {
  console.error('❌ Error uploading products:', error);
});
