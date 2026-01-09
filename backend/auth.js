const firebaseConfig = {
    apiKey: "AIzaSyCwHSefApnq82su3wZrSQ5GC4jdmnoiqL0",
    authDomain: "barbearia-63be3.firebaseapp.com",
    projectId: "barbearia-63be3",
    storageBucket: "barbearia-63be3.firebasestorage.app",
    messagingSenderId: "1018794607068",
    appId: "1:1018794607068:web:c0f402996b97d90d760f19"
  };
  firebase.initializeApp(firebaseConfig);

firebase.auth().signInWithEmailAndPassword("brunodubalhoffmann@hotmail.com", "123456").then(response =>{
        console.log("Usuário logado com sucesso!", response);
}).catch(error =>{
    console.error("Erro ao logar o usuário:", error);
});