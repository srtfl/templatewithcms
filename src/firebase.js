// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Safely load environment variables
const {
  REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID
} = process.env;

// Throw helpful error if any key is missing
if (
  !REACT_APP_FIREBASE_API_KEY ||
  !REACT_APP_FIREBASE_AUTH_DOMAIN ||
  !REACT_APP_FIREBASE_PROJECT_ID ||
  !REACT_APP_FIREBASE_STORAGE_BUCKET ||
  !REACT_APP_FIREBASE_MESSAGING_SENDER_ID ||
  !REACT_APP_FIREBASE_APP_ID
) {
  throw new Error("Missing one or more Firebase environment variables. Check your .env file.");
}

// Firebase configuration
const firebaseConfig = {
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
