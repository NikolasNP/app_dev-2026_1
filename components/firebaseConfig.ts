// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7upttp2a88MBhTb91hslwNVP6LSV_WqM",
  authDomain: "meau-94635.firebaseapp.com",
  projectId: "meau-94635",
  storageBucket: "meau-94635.firebasestorage.app",
  messagingSenderId: "967467954555",
  appId: "1:967467954555:web:2d3e2827b7d638f7218dde",
  measurementId: "G-X6F6JPW19X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);