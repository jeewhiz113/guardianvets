import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore'
const firebaseApp = initializeApp({
  apiKey: "AIzaSyBldmf1aP4-vKGd0r-RXMrXUsFvAScN94Y",
  authDomain: "guardianvets-b76d0.firebaseapp.com",
  projectId: "guardianvets-b76d0",
  storageBucket: "guardianvets-b76d0.appspot.com",
  messagingSenderId: "157584988910",
  appId: "1:157584988910:web:02fcf3286267b971c371ff"
});

const db = getFirestore(firebaseApp);

export default db;