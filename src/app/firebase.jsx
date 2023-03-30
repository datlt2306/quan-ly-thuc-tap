// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgD8VSg2WnGT8KvgbrNdtlSMISwhsX0ZQ",
  authDomain: "duantotnghiep-8245b.firebaseapp.com",
  projectId: "duantotnghiep-8245b",
  storageBucket: "duantotnghiep-8245b.appspot.com",
  messagingSenderId: "1017936873039",
  appId: "1:1017936873039:web:57e143a368506fdd518c3a",
  measurementId: "G-LJ64YQ28CW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);