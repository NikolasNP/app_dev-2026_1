//import { initializeApp } from "firebase/app";
//import { getAuth } from "firebase/auth";

//const firebaseConfig = {
//  apiKey: "AIzaSyBBLgCUsNqbhufTirVUgYIg8ywyHpDakJs",
//  authDomain: "meau-adea2.firebaseapp.com",
//  projectId: "meau-adea2",
//  storageBucket: "meau-adea2.firebasestorage.app",
//  messagingSenderId: "896996881322",
//  appId: "1:896996881322:web:732ec24392a1bce84eb1d3",
//  measurementId: "G-G3QTNYJG68"
//};

//const app = initializeApp(firebaseConfig);

// EXPORTAÇÃO DO AUTH
//export const auth = getAuth(app);



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChdJIP1-G-1S5YWmVlsSvCOZaWgwMw16c",
  authDomain: "mecanismo-autenticacao.firebaseapp.com",
  projectId: "mecanismo-autenticacao",
  storageBucket: "mecanismo-autenticacao.firebasestorage.app",
  messagingSenderId: "233087703566",
  appId: "1:233087703566:web:1ed2429538fbc408a13a5f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);