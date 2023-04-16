// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAH9KHYv3dKdAtpMciPLJThYXpBgKS8ypY',
  authDomain: 'rpg-store-f3c42.firebaseapp.com',
  projectId: 'rpg-store-f3c42',
  storageBucket: 'rpg-store-f3c42.appspot.com',
  messagingSenderId: '184296071809',
  appId: '1:184296071809:web:91b7f75aada5c9529b6380',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)
