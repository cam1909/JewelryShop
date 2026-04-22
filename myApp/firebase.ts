// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUazEYOJNrTSzHCfXo0xNehK5iMgQ6Kfc",
  authDomain: "jewelryshop-123.firebaseapp.com",
  projectId: "jewelryshop-123",
  storageBucket: "jewelryshop-123.appspot.com",
  messagingSenderId: "268868689802",
  appId: "1:268868689802:web:830be459fc5818ae053273",
  measurementId: "G-EJE57JH09G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication (chỉ dùng Firebase cho xác thực)
export const auth = getAuth(app);
