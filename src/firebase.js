// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDB1AIs2OcYwctX4ur8TqqqfMzWlIBOSzE",
  authDomain: "cftl-lms.firebaseapp.com",
  projectId: "cftl-lms",
  storageBucket: "cftl-lms.firebasestorage.app",
  messagingSenderId: "440654736937",
  appId: "1:440654736937:web:d0bed7bfe918405cd97638",
  measurementId: "G-TDN9ZC6286"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
