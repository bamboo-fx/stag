import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBvWVcWadpSy81GRc8VQRld7dcehxPGxfw",
  authDomain: "stag-4f2c3.firebaseapp.com",
  projectId: "stag-4f2c3",
  storageBucket: "stag-4f2c3.firebasestorage.app",
  messagingSenderId: "676142600799",
  appId: "1:676142600799:web:31b20d3aa806b447fb01ea",
  measurementId: "G-KTE7PHQXH4"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)