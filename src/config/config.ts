import { initializeApp } from 'firebase/app';
import { getFirestore } from '@firebase/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAOTM970gksYH_jzprHtlwtC4GEUnclZlY",
    authDomain: "test-e87b5.firebaseapp.com",
    projectId: "test-e87b5",
    storageBucket: "test-e87b5.appspot.com",
    messagingSenderId: "459982675800",
    appId: "1:459982675800:web:a71b4eaea1a31e56048f2d",
};

firebase.initializeApp(firebaseConfig);
const dbf = getFirestore();

export { dbf, firebase };


