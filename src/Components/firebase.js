// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBTvbOkwnO_bpsRak9z1_EgFZus2KqLYJU",
//   authDomain: "maverickbank-9bed9.firebaseapp.com",
//   projectId: "maverickbank-9bed9",
//   storageBucket: "maverickbank-9bed9.appspot.com",
//   messagingSenderId: "157362365417",
//   appId: "1:157362365417:web:88af52c95689f7fc8d2178",
//   measurementId: "G-GENGHCELY6",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const auth = getAuth(app);
// const provider = new GoogleAuthProvider();

// export { auth, provider, signInWithPopup, analytics };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTvbOkwnO_bpsRak9z1_EgFZus2KqLYJU",
  authDomain: "maverickbank-9bed9.firebaseapp.com",
  projectId: "maverickbank-9bed9",
  storageBucket: "maverickbank-9bed9.appspot.com",
  messagingSenderId: "157362365417",
  appId: "1:157362365417:web:88af52c95689f7fc8d2178",
  measurementId: "G-GENGHCELY6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signInWithRedirect, getRedirectResult, analytics };