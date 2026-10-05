// Replace these placeholder values with your Firebase project's web app config.
// Firebase Console → Project settings → Your apps → Web app.
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDkXhNeKAZox2pF_KtL4VXjSB-5ukMBr2Y",
  authDomain: "artshare07.firebaseapp.com",
  projectId: "artshare07",
  storageBucket: "artshare07.firebasestorage.app",
  messagingSenderId: "24998837971",
  appId: "1:24998837971:web:0eabab2373350213f6de26",
  measurementId: "G-X1M83HPYYD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
