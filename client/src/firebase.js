// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FRIREBASE_APIKEY,
  authDomain: "mern-estate-c88a2.firebaseapp.com",
  projectId: "mern-estate-c88a2",
  storageBucket: "mern-estate-c88a2.appspot.com",
  messagingSenderId: "79917004612",
  appId: "1:79917004612:web:fb0e4dd8f6bc80a0180911"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);