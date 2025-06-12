import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgxGxnhu7OTriXiyIYEr8O2BYnUoSFT8w",
  authDomain: "auth-themoviebase.firebaseapp.com",
  projectId: "auth-themoviebase",
  storageBucket: "auth-themoviebase.appspot.com",
  messagingSenderId: "941529858562",
  appId: "1:941529858562:web:f80d54d3fb4783d1975d1b",
  measurementId: "G-HTHVEZY0XL",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ Initialize Firestore

// ✅ Export all needed services
export { app, auth, db };