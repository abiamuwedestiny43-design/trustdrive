import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAaJYTDnXEC6bRYsjNX4gvmWdH19h_qqAo",
    authDomain: "trust-drive-management.firebaseapp.com",
    projectId: "trust-drive-management",
    storageBucket: "trust-drive-management.firebasestorage.app",
    messagingSenderId: "948572391891",
    appId: "1:948572391891:web:44cfc1e3cf65af5e870726"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
