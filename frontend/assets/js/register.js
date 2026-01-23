document.addEventListener("DOMContentLoaded", function () {
    // ===== FUNÇÃO DE REGISTRO =====
    const emailInput = document.getElementById("reg-email");
    const passwordInput = document.getElementById("reg-password");
    const passwordConfirmInput = document.getElementById("reg-password-confirm");
    const nameInput = document.getElementById("reg-name");
    const btnRegister = document.getElementById("btn-reg");
    const feedback = document.getElementById("reg-invalid-feedback");

    // ================================
    // VALIDAÇÃO EM TEMPO REAL
    // ================================
    function validarFormularioRegistro() {
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const passwordConfirm = passwordConfirmInput.value;
        const name = nameInput.value.trim();

        const valido =
            email &&
            email &&
            name &&
<<<<<<< HEAD
            celInput.value.length >= 8 &&
=======
>>>>>>> parent of 7f68fae (Merge branch 'main' of https://github.com/Vinn1Ramos/barbearia)
            password &&
            passwordConfirm;

        btnRegister.disabled = !valido;
    }

    // Botão começa desabilitado
    btnRegister.disabled = true;

    // Escuta digitação
    [emailInput, passwordInput, passwordConfirmInput, nameInput].forEach(input => {
        input.addEventListener("input", validarFormularioRegistro);
    });

    // ================================
    // SUBMIT DO REGISTRO
    // ================================
    btnRegister.addEventListener("click", function (e) {
        e.preventDefault();
        showLoading();

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const passwordConfirm = passwordConfirmInput.value;
        const name = nameInput.value.trim();

        console.log("Tentando registrar com", email);

        if (password !== passwordConfirm) {
            hideLoading();
            feedback.textContent = "As senhas não coincidem.";
            feedback.style.display = "block";
            return;
        }

        firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;

                await user.sendEmailVerification();

                const uid = user.uid;
                const idToken = await user.getIdToken();
                console.log('teste1')
                const payload = {
                    nome: name,
                    telefone: celular,
                    email: user.email,
                    firebase_uid: uid,
                    criado_em: new Date().toISOString()
                }
                console.log(payload)
                localStorage.setItem('idToken', JSON.stringify(idToken))
                localStorage.setItem('pendingProfile', JSON.stringify(payload))
                await firebase.auth().signOut();

                hideLoading();
                feedback.textContent = "Cadastro realizado! Verifique seu email para ativar a conta.";
                feedback.style.display = "block";
                setTimeout(() => window.location.href = "./login.html", 1000);
            })
            .catch(error => {
                hideLoading();
                console.error(error);
                if (error.code === "auth/weak-password") {
                    feedback.textContent = "Senha muito fraca (mínimo 6 caracteres).";
                } else if (error.code === "auth/invalid-email") {
                    feedback.textContent = "Email inválido.";
                } else if (error.code === "auth/email-already-in-use") {
                    feedback.textContent = "Este email já está cadastrado.";
                } else {
                    feedback.textContent = "Erro ao registrar usuário.";
                }
                feedback.style.display = "block";
            });
    });
});