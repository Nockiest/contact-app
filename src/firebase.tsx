


 
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import getFirestore function from the firestore package

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCV0sjWGC1tV0KWeoYepvacXqWz0MLPgSI",
    authDomain: "contacts-cfe1b.firebaseapp.com",
    projectId: "contacts-cfe1b",
    storageBucket: "contacts-cfe1b.appspot.com",
    messagingSenderId: "703751154930",
    appId: "1:703751154930:web:475dd129fa7d553acab46b"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// If you're using Firestore
const db = getFirestore(app); // Initialize Firestore using getFirestore function

// If you're using Firebase Authentication
// const auth = app.auth(); // Uncomment this line if you're using Firebase Authentication

export { db }; //, auth };
