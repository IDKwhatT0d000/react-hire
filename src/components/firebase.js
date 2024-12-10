// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIb-Filn_eq-6kkGc0y50CvCDEI1rttzU",
  authDomain: "pro2-a97e6.firebaseapp.com",
  projectId: "pro2-a97e6",
  storageBucket: "pro2-a97e6.firebasestorage.app",
  messagingSenderId: "888194846602",
  appId: "1:888194846602:web:ea67fa8f2d5ffbb4a74273"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth();
export const db=getFirestore(app);
export default app;