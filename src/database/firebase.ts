import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAmJU1PIycZAoBFXBoRiaeoBMQR6XMic5I",
  authDomain: "gashup-72fc2.firebaseapp.com",
  projectId: "gashup-72fc2",
  storageBucket: "gashup-72fc2.appspot.com",
  messagingSenderId: "307691557828",
  appId: "1:307691557828:web:b5737c3d6de79596cfca91",
  measurementId: "G-33ZHY3MPZH",
};

const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
const dbf = getFirestore(app);

export { dbf, firebase };
