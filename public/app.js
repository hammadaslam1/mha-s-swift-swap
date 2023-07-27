import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  onChildAdded,
  update,
  remove,
  push,
  child,
  orderByChild,
  // onChildAdded,
  query,
  limitToLast,
  startAt,
  get,

} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyD1tN6zuuX02qKLSuugOHwoKVTauqoQHow",
  authDomain: "mha-s-swift-swap.firebaseapp.com",
  projectId: "mha-s-swift-swap",
  storageBucket: "mha-s-swift-swap.appspot.com",
  messagingSenderId: "551824882847",
  appId: "1:551824882847:web:734eef6d42b32e9fe136aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase();
export {
  app, database, ref, set, onValue, onChildAdded, update, remove, push, child, orderByChild, query, startAt, getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  limitToLast,
  get
};
