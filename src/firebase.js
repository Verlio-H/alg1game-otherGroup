// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4msfF1vaIKjqhRUwOG00wkUm_nwy1QF8",
  authDomain: "alg1game.firebaseapp.com",
  projectId: "alg1game",
  storageBucket: "alg1game.appspot.com",
  messagingSenderId: "1072162104106",
  appId: "1:1072162104106:web:32a1f23a239b7df3a33453",
  measurementId: "G-C6Z8GPYPX9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);