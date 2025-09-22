import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA_TbfgNR1XP9x0Fn_mYQ9wfT_JHBXqccA",
  authDomain: "quoteprint3d-demo.firebaseapp.com",
  projectId: "quoteprint3d-demo",
  storageBucket: "quoteprint3d-demo.appspot.com",
  messagingSenderId: "117456387523",
  appId: "1:117456387523:web:fe39a4dac1a89f91fc52b5"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export default app;
