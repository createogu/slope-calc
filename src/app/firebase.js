import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB7eRXYkjWsk0qofvn9Dl2E2rUazMVwYLY",
  authDomain: "slope-calculator-b9cbc.firebaseapp.com",
  projectId: "slope-calculator-b9cbc",
  storageBucket: "slope-calculator-b9cbc.appspot.com",
  messagingSenderId: "578515403185",
  appId: "1:578515403185:web:5190c43fff91c2fe637d90",
  measurementId: "G-9P9W9T8TLB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
