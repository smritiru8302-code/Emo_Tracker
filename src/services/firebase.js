import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyCxStfBAjdZK2WiLvm9Yy-z8LtoSIc3S00",
    authDomain: "emo-tracker-c927e.firebaseapp.com",
    projectId: "emo-tracker-c927e",
    storageBucket: "emo-tracker-c927e.firebasestorage.app",
    messagingSenderId: "189851160007",
    appId: "1:189851160007:web:c86b8f51c07ccb0eafdde2",
    measurementId: "G-RX3YH4GQYN",
};

const isConfigured = true;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, isConfigured };
