// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // Uncomment if analytics is needed

const firebaseConfig = {
  apiKey: "AIzaSyAdQhQbf7ej1BKcQYnfIit4EyFyYexPBY4",
  authDomain: "classroom-sign-in.firebaseapp.com",
  projectId: "classroom-sign-in",
  storageBucket: "classroom-sign-in.appspot.com",
  messagingSenderId: "323304616068",
  appId: "1:323304616068:web:79201c4729c0150b4ed2d1",
  measurementId: "G-FR6939HDXP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const firestore = getFirestore(app);
// const analytics = getAnalytics(app); // Uncomment if analytics is needed

export { auth, firestore };
