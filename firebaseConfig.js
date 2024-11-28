// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
//  !!AGREGAR IMPORT PARA LA AUTENTICACION!!

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1qg87gI9JnJrXQgDV6VQtLyGyfpcwd-s",
  authDomain: "aparclic.firebaseapp.com",
  projectId: "aparclic",
  storageBucket: "aparclic.firebasestorage.app",
  messagingSenderId: "268429078989",
  appId: "1:268429078989:web:30aa41d2deab8ddd88d484"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {db};