import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBBLgCUsNqbhufTirVUgYIg8ywyHpDakJs",
  authDomain: "meau-adea2.firebaseapp.com",
  projectId: "meau-adea2",
  storageBucket: "meau-adea2.firebasestorage.app",
  messagingSenderId: "896996881322",
  appId: "1:896996881322:web:732ec24392a1bce84eb1d3",
  measurementId: "G-G3QTNYJG68"
};

const app = initializeApp(firebaseConfig);

// EXPORTAÇÃO DO AUTH
export const auth = getAuth(app);