// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDrg2uYdRKvsxA5B6d2HX89jhMvudSCkUA",
    authDomain: "finance-assistant-505db.firebaseapp.com",
    projectId: "finance-assistant-505db",
    storageBucket: "finance-assistant-505db.appspot.com",
    messagingSenderId: "331343669905",
    appId: "1:331343669905:web:8e5573cc617182b8cd6d30",
    measurementId: "G-3WZ747BX4Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app); // Firebase Authentication
export const db = getFirestore(app); // Firestore Database
export const analytics = getAnalytics(app); // Firebase Analytics
