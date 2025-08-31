// frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const FIREBASE_AUTH_DOMAIN = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const FIREBASE_PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const FIREBASE_APP_ID = import.meta.env.VITE_FIREBASE_APP_ID;

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  appId: FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Utility functions
export async function signupEmail(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function signinEmail(email, password) {
    console.log('Signing in with email:', email);
    console.log('Signing in with password:', password);
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function signinGoogle() {
  return await signInWithPopup(auth, googleProvider);
}
