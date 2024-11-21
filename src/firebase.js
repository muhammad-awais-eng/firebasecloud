import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCdipkctM8mchkmau7Y6ePP8gDXqVLVgX8",
  authDomain: "burger-app-bc968.firebaseapp.com",
  projectId: "burger-app-bc968",
  storageBucket: "burger-app-bc968.appspot.com",
  messagingSenderId: "77240253199",
  appId: "1:77240253199:web:d050e627a9ad87be41dc7a",
  measurementId: "G-2KPZ59TQ37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { db,storage };