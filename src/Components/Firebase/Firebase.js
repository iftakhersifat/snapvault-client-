// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAe76M3dRoEv769nv_tL0vtvBr98cO_0Dw",
  authDomain: "my-projects-ee4aa.firebaseapp.com",
  projectId: "my-projects-ee4aa",
  storageBucket: "my-projects-ee4aa.firebasestorage.app",
  messagingSenderId: "912419988357",
  appId: "1:912419988357:web:0b9814b3f583873c46daec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);