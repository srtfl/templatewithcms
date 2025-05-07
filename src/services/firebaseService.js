import { db } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import config from '../config';

// Helper function to validate data against schema
const validateData = (data, schema, collectionName) => {
  const requiredFields = schema.requiredFields || [];
  const missingFields = requiredFields.filter((field) => data[field] === undefined);
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields for ${collectionName}: ${missingFields.join(', ')}`);
  }
};

// Categories
export const getCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error in getCategories:', error);
    throw error;
  }
};

export const addCategory = async (categoryData) => {
  try {
    // Validate required fields
    validateData(categoryData, config.firestoreSchema.categories, 'categories');

    // Sanitize value field
    const sanitizedValue = categoryData.value.replace(/[^a-zA-Z0-9-_]/g, '-');
    const categoryRef = doc(collection(db, 'categories'), sanitizedValue);

    // Prepare data with required and optional fields
    const data = {
      value: sanitizedValue,
      displayName: categoryData.displayName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Include optional fields if provided
    config.firestoreSchema.categories.optionalFields.forEach((field) => {
      if (categoryData[field] !== undefined) {
        data[field] = categoryData[field];
      }
    });

    await setDoc(categoryRef, data, { merge: true });
    return categoryRef.id;
  } catch (error) {
    console.error('Error in addCategory:', error);
    throw error;
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    // Validate required fields
    validateData(categoryData, config.firestoreSchema.categories, 'categories');

    const categoryRef = doc(db, 'categories', id);

    // Prepare data with required and optional fields
    const data = {
      value: categoryData.value,
      displayName: categoryData.displayName,
      updatedAt: serverTimestamp(),
    };

    // Include optional fields if provided
    config.firestoreSchema.categories.optionalFields.forEach((field) => {
      if (categoryData[field] !== undefined) {
        data[field] = categoryData[field];
      }
    });

    await setDoc(categoryRef, data, { merge: true });
  } catch (error) {
    console.error('Error in updateCategory:', error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const categoryRef = doc(db, 'categories', id);
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    throw error;
  }
};

// Products
export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    // Validate required fields
    validateData(productData, config.firestoreSchema.products, 'products');

    const productRef = doc(collection(db, 'products'));

    // Prepare data with required and optional fields
    const data = {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(productRef, data, { merge: true });
    return productRef.id;
  } catch (error) {
    console.error('Error in addProduct:', error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    // Validate required fields
    validateData(productData, config.firestoreSchema.products, 'products');

    const productRef = doc(db, 'products', id);

    // Prepare data with required and optional fields
    const data = {
      ...productData,
      updatedAt: serverTimestamp(),
    };

    await setDoc(productRef, data, { merge: true });
  } catch (error) {
    console.error('Error in updateProduct:', error);
    throw error;
  }
};

export const saveProduct = async (productData) => {
  try {
    if (productData.id) {
      await updateProduct(productData.id, productData);
      return productData.id;
    } else {
      const newId = await addProduct(productData);
      return newId;
    }
  } catch (error) {
    console.error('Error in saveProduct:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    throw error;
  }
};

// Promotions
export const getPromotions = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'promotions'));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error in getPromotions:', error);
    throw error;
  }
};

export const addPromotion = async (promotionData) => {
  try {
    // Validate required fields
    validateData(promotionData, config.firestoreSchema.promotions, 'promotions');

    // Validate promotion type if provided
    if (promotionData.type && !config.promotionTypes[promotionData.type]) {
      throw new Error(`Invalid promotion type: ${promotionData.type}`);
    }

    const promotionRef = doc(collection(db, 'promotions'));

    // Prepare data with required and optional fields
    const data = {
      ...promotionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(promotionRef, data, { merge: true });
    return promotionRef.id;
  } catch (error) {
    console.error('Error in addPromotion:', error);
    throw error;
  }
};

export const updatePromotion = async (id, promotionData) => {
  try {
    // Validate required fields
    validateData(promotionData, config.firestoreSchema.promotions, 'promotions');

    // Validate promotion type if provided
    if (promotionData.type && !config.promotionTypes[promotionData.type]) {
      throw new Error(`Invalid promotion type: ${promotionData.type}`);
    }

    const promotionRef = doc(db, 'promotions', id);

    // Prepare data with required and optional fields
    const data = {
      ...promotionData,
      updatedAt: serverTimestamp(),
    };

    await setDoc(promotionRef, data, { merge: true });
  } catch (error) {
    console.error('Error in updatePromotion:', error);
    throw error;
  }
};

export const savePromotion = async (promotionData) => {
  try {
    if (promotionData.id) {
      await updatePromotion(promotionData.id, promotionData);
      return promotionData.id;
    } else {
      const newId = await addPromotion(promotionData);
      return newId;
    }
  } catch (error) {
    console.error('Error in savePromotion:', error);
    throw error;
  }
};

export const deletePromotion = async (promotionId) => {
  try {
    const promotionRef = doc(db, 'promotions', promotionId);
    await deleteDoc(promotionRef);
  } catch (error) {
    console.error('Error in deletePromotion:', error);
    throw error;
  }
};