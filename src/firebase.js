import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyAdYkvddRoEjG2xtMnJfCb-Su4fGOP57yI",
    authDomain: "drive-cl-a97f5.firebaseapp.com",
    projectId: "drive-cl-a97f5",
    storageBucket: "drive-cl-a97f5.appspot.com",
    messagingSenderId: "1017046815877",
    appId: "1:1017046815877:web:fe79ca2a46012292da85ec"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const storage = firebase.storage();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, storage, auth, provider }