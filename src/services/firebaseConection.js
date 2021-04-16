import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBfMfgibkedkliM93edl_D2_9IWWTESj0Q',
  authDomain: 'sistema-6bd19.firebaseapp.com',
  projectId: 'sistema-6bd19',
  storageBucket: 'sistema-6bd19.appspot.com',
  messagingSenderId: '316082131521',
  appId: '1:316082131521:web:0cb3b02f4cb1e5ade92cc0',
  measurementId: 'G-6L0TYP9FFZ'
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
