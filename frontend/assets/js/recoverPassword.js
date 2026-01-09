document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("login-email");
    const btnRecover = document.getElementById("recover-password");

    if (emailInput && btnRecover) {
        // Garante que inicia desabilitado
        btnRecover.disabled = true;

        emailInput.addEventListener("input", () => {
            const email = emailInput.value.trim();

            // Regex simples para email válido
            const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            btnRecover.disabled = !emailValido;
        });
    }

    if (btnRecover) {
        btnRecover.addEventListener("click", function (e) {
            e.preventDefault();
            showLoading();
            const email = document.getElementById("login-email").value.trim();
            console.log("Tentando recuperar senha para", email);

            // Envia email de recuperação de senha
            firebase.auth().sendPasswordResetEmail(email).then(() => {
                hideLoading();
                document.getElementById("invalid-feedback").textContent = "Email de recuperação de senha enviado com sucesso!";
                document.getElementById("invalid-feedback").style.display = "block";
            }).catch((error) => {
                // Trata erro ao enviar email de recuperação
                hideLoading();
                console.error("Erro ao enviar email de recuperação de senha:", error);
                if (!email) {
                    document.getElementById("invalid-feedback").textContent = "Por favor, insira seu email para recuperação de senha.";
                    document.getElementById("invalid-feedback").style.display = "block";
                } else if (error.code === "auth/invalid-email") {
                    document.getElementById("invalid-feedback").textContent = "Email inválido.";
                    document.getElementById("invalid-feedback").style.display = "block";
                }
            });
        });
    };
});