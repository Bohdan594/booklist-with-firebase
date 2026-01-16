import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXMaTrc29vqF3rEDarytAMw3L2MvqZJ9s",
  authDomain: "your-book-list.firebaseapp.com",
  projectId: "your-book-list",
  storageBucket: "your-book-list.firebasestorage.app",
  messagingSenderId: "106708083887",
  appId: "1:106708083887:web:d6cd29ea2672f9117d605a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);