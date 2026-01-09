const firebaseConfig = {
    apiKey: "AIzaSyCwHSefApnq82su3wZrSQ5GC4jdmnoiqL0",
    authDomain: "barbearia-63be3.firebaseapp.com",
    projectId: "barbearia-63be3",
    storageBucket: "barbearia-63be3.firebasestorage.app",
    messagingSenderId: "1018794607068",
    appId: "1:1018794607068:web:c0f402996b97d90d760f19"
  };
  firebase.initializeApp(firebaseConfig);

document.getElementById("btn-login").addEventListener("click", function(e){
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    console.log("Tentando logar com", email, password);

    //valida os diferentes erros de auth e exibe mensagem de correção de acordo com o erro
    firebase.auth().signInWithEmailAndPassword(email, password).then(response =>{
        console.log("Usuário logado com sucesso!", response);
    }).catch(error =>{
        console.error("Erro ao logar o usuário:", error);
        console.log("Código do erro:", error.code);
        if(!password || !email){
            document.getElementById("invalid-feedback").textContent = "Email e senha não podem estar vazios.";
            document.getElementById("invalid-feedback").style.display = "block";
        } else if(error.code === "auth/invalid-credential"){
            document.getElementById("invalid-feedback").textContent = "Credenciais inválidas.";
            document.getElementById("invalid-feedback").style.display = "block";
        } else if(error.code === "auth/invalid-email"){
            document.getElementById("invalid-feedback").textContent = "Email inválido.";
            document.getElementById("invalid-feedback").style.display = "block";
        };
    });
});