import firebase from 'firebase'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCEw8gSl-cbtQsfXt8Kn68avZiabZeNBSs',
  authDomain: 'whatellz.firebaseapp.com',
  projectId: 'whatellz',
  storageBucket: 'whatellz.appspot.com',
  messagingSenderId: '973897093844',
  appId: '1:973897093844:web:fd03663cb977d909b26141',
  measurementId: 'G-JJ33EMCGHY',
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()
const auth = firebase.auth()

export { auth, db }
