import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = firebase.initializeApp({
  apiKey: "AIzaSyA88SUj1JA_lLDuHO9QozJfUUy5efsDkGo",
  authDomain: "todoist-8c005.firebaseapp.com",
  databaseURL: "https://todoist-8c005.firebaseio.com",
  projectId: "todoist-8c005",
  storageBucket: "todoist-8c005.appspot.com",
  messagingSenderId: "358182793859",
  appId: "1:358182793859:web:7a88843774c62d10"
});

export { firebaseConfig as firebase };
