// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  authDomain: "up-grade-ef576.firebaseapp.com",
  projectId: "up-grade-ef576",
  storageBucket: "up-grade-ef576.firebasestorage.app",
  messagingSenderId: "410149931911",
  appId: "1:410149931911:web:3041cac4c87eed55a16122",
  measurementId: "G-TRREVN4HK6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };



