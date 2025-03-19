// Import Firebase SDK directly from the CDN (instead of node_modules)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase configuration object (contains project credentials)
const firebaseConfig = {
    apiKey: "AIzaSyAaOtIgw6_W9pVdTEIwINbhoIDpeWjeEG4",  // API key (keep this private)
    authDomain: "join-backend-f7fb2.firebaseapp.com",  // Authentication domain
    projectId: "join-backend-f7fb2",  // Unique Firebase project ID
    storageBucket: "join-backend-f7fb2.firebasestorage.app",  // Cloud storage for file uploads
    messagingSenderId: "571924242111",  // Messaging sender ID (for notifications)
    appId: "1:571924242111:web:2332b4b3b57c9d9d4cf00a"  // Unique app identifier
};

// Initialize Firebase app with the given configuration
const app = initializeApp(firebaseConfig);

// Initialize Firestore database instance
const db = getFirestore(app);

// Export Firestore database to use it in other scripts
export { db };