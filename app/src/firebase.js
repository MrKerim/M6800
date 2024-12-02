// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



let db = false;

export const getDb = () => {
  if (!db) {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyAkMRl5Qt6y9LyTOnk9CPttKcR0naldmHs",
      authDomain: "m-6800.firebaseapp.com",
      projectId: "m-6800",
      storageBucket: "m-6800.firebasestorage.app",
      messagingSenderId: "473623335419",
      appId: "1:473623335419:web:bf70d0835d88b6d7237b5e",
      measurementId: "G-NEK8CLJKGK"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    getAnalytics(app);

    db = getFirestore(app)
  }

  return db
}