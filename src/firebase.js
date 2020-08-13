import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/database';

// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCWOZGzdGj9hui2vnbsdDtaGLjjAPz99J4",
    authDomain: "listapp-24506.firebaseapp.com",
    databaseURL: "https://listapp-24506.firebaseio.com",
    projectId: "listapp-24506",
    storageBucket: "listapp-24506.appspot.com",
    messagingSenderId: "984857252519",
    appId: "1:984857252519:web:cff8e712ae14e5229f4182",
    measurementId: "G-XQLVXTP1S0"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

export default firebase;