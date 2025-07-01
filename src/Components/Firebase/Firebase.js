import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAe76M3dRoEv769nv_tL0vtvBr98cO_0Dw",
  authDomain: "my-projects-ee4aa.firebaseapp.com",
  projectId: "my-projects-ee4aa",
  storageBucket: "my-projects-ee4aa.appspot.com",
  messagingSenderId: "912419988357",
  appId: "1:912419988357:web:0b9814b3f583873c46daec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export these for use in your app
export const auth = getAuth(app);
export const db = getFirestore(app);         // <-- Needed for Firestore
export const storage = getStorage(app);       // <-- Needed for file upload
