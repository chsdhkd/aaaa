// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC61Knl5cLtztAk13LH8R2Sfp3QAeNyG5I",
  authDomain: "chsdhkd-c2072.firebaseapp.com",
  projectId: "chsdhkd-c2072",
  storageBucket: "chsdhkd-c2072.firebasestorage.app",
  messagingSenderId: "960905359501",
  appId: "1:960905359501:web:3018ba9884b6dbb36472c4",
  measurementId: "G-TTBG49NVWL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);




// 🧠 Firestore 객체 생성
const db = getFirestore(app);

// ✅ db 내보내기
export { db };
