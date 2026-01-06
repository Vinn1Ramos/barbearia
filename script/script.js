// Aguarda o carregamento total do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. CAPTURA DE CLIQUES (Delegação de Eventos)
    document.addEventListener('click', function(e) {
        const target = e.target;

        // --- Lógica do Botão "Agendar Agora" ---
        if (target.closest('.cta-agendar')) {
            const token = localStorage.getItem('token');
            
            // Se NÃO estiver logado
            if (!token) {
                e.preventDefault(); // Para o link
                const btn = target.closest('.cta-agendar');
                const nextUrl = btn.getAttribute('href') || 'functions/agendamento.html';
                
                abrirModal(nextUrl);
            }
        }

        // --- Lógica de Fechar o Modal (X ou Botão Cancelar) ---
        if (target.closest('#modal-close-btn') || target.closest('.modal-close')) {
            fecharModal();
        }

        // --- Lógica de clicar no Backdrop (fora do modal) ---
        if (target.classList.contains('modal-backdrop') || target.classList.contains('modal-root')) {
            fecharModal();
        }

        // --- Lógica do Botão "Entrar" dentro do Modal ---
        if (target.closest('#modal-login-btn')) {
            e.preventDefault();
            const modal = document.getElementById('login-modal');
            const proximoPasso = modal.dataset.next || 'functions/agendamento.html';
            // Redireciona para a tela de login levando o destino original
            window.location.href = 'functions/login.html?next=' + encodeURIComponent(proximoPasso);
        }
    });

    // 2. FUNÇÕES DE SUPORTE
    function abrirModal(url) {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.dataset.next = url;
            modal.classList.add('modal-open');
            modal.setAttribute('aria-hidden', 'false');
            modal.style.visibility = 'visible'; // Garante visibilidade
            modal.style.pointerEvents = 'auto'; // Garante que aceite cliques
        }
    }

    function fecharModal() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.classList.remove('modal-open');
            modal.setAttribute('aria-hidden', 'true');
            modal.style.visibility = 'hidden';
            modal.style.pointerEvents = 'none';
        }
    }

    // 3. EFEITO DO HEADER AO ROLAR
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (header) {
            header.style.backgroundColor = window.scrollY > 50 ? '#000' : 'rgba(0, 0, 0, 0.9)';
        }
    });

    // 4. FECHAR COM TECLA ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') fecharModal();
    });
});