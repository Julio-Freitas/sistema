# sistema
For to use this app, is necessary a project in firebase.
After create the project in firebase, you should create a folder  and an file.
name folder services
name file firebaseConection
look path: src/services/firebaseConection.js
inside firebaseConection, configure your app. 

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: ''
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
run yarn start or npm start 
all ready! =D