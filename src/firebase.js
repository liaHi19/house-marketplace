// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "house-marketplace-a4b86.firebaseapp.com",
  projectId: "house-marketplace-a4b86",
  storageBucket: "house-marketplace-a4b86.appspot.com",
  messagingSenderId: "645040412753",
  appId: "1:645040412753:web:01c4ccf474aab2cb094070",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
