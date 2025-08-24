
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import {
  getAuth, GoogleAuthProvider, onAuthStateChanged,
  signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, signOut
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBkiCJ8Y6NUPdJNGOp3njw7r-YgQ404GyU",
  authDomain: "as-2-b1ba4.firebaseapp.com",
  projectId: "as-2-b1ba4",
  storageBucket: "as-2-b1ba4.firebasestorage.app",
  messagingSenderId: "997555797487",
  appId: "1:997555797487:web:f3634cc4a7c96849128a1a",
  measurementId: "G-WCT10RTXGZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// 工具方法：等待登录状态恢复（刷新页面时用）
export function waitForAuthInit() {
  return new Promise(resolve => {
    const unsub = onAuthStateChanged(auth, user => {
      unsub()
      resolve(user)
    })
  })
}

export const apiAuth = {
  loginEmail: (email, password) => signInWithEmailAndPassword(auth, email, password),
  loginGoogle: () => signInWithPopup(auth, googleProvider),
  registerEmail: (email, password) => createUserWithEmailAndPassword(auth, email, password),
  logout: () => signOut(auth),
}