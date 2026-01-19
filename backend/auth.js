const API = "https://spoutless-catarina-immusically.ngrok-free.dev";

// backend/auth.js
const firebaseConfig = {
  apiKey: "AIzaSyCwHSefApnq82su3wZrSQ5GC4jdmnoiqL0",
  authDomain: "barbearia-63be3.firebaseapp.com",
  projectId: "barbearia-63be3",
  storageBucket: "barbearia-63be3.firebasestorage.app",
  messagingSenderId: "1018794607068",
  appId: "1:1018794607068:web:c0f402996b97d90d760f19"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

console.log("🔥 Firebase inicializado");
// Agora você pode usar firebase.auth(), firebase.firestore(), etc.