// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import dotenv from "dotenv";

dotenv.config();
// TODO: Add SDKs for Firebase products that yoku want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "wits-services-ea5cf.firebaseapp.com",
  projectId: "wits-services-ea5cf",
  storageBucket: "wits-services-ea5cf.appspot.com",
  messagingSenderId: "147092371359",
  appId: "1:147092371359:web:501ef87c23a1d4814dafaa",
  measurementId: "G-VQ8DBKB9T1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
// export const storage = getStorage(app);
