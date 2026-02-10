// ================================
// SCRIPT PRINCIPAL - RAMOS BARBEARIA
// ================================

document.addEventListener('DOMContentLoaded', () => {
    /* =====================================
       AUTENTICAÇÃO (LOGIN / LOGOUT)
    ===================================== */
    const authBtn = document.getElementById('auth-btn');
    const token = localStorage.getItem('token');

    if (authBtn) {
        if (token) {
            // Usuário logado → botão vira "Sair"
            authBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
            authBtn.title = 'Sair';

            authBtn.addEventListener('click', () => {
                localStorage.removeItem('token');
                window.location.reload();
            });

        } else {
            // Usuário não logado → redireciona para login
            authBtn.addEventListener('click', () => {
                window.location.href = 'pages/login.html';
            });
        }
    }

    /* =====================================
       PROTEÇÃO DO BOTÃO "AGENDAR"
    ===================================== */
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.cta-agendar');
        if (!btn) return;

        e.preventDefault(); // 🔒 SEMPRE bloqueia o href
        // ============================
        // CONTROLE DE USUÁRIO LOGADO
        // ============================

        firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                // Redireciona para login com página de retorno
                abrirModal(window.location.href);
                return;
            } else {
                // Usuário logado → vai direto
                window.location.href = 'pages/agendamento.html';
            }
        });
    });

    /* =====================================
       MODAL DE LOGIN
    ===================================== */
    const modal = document.getElementById('login-modal');
    const modalLoginBtn = document.getElementById('modal-login-btn');


    function abrirModal(nextUrl) {
        if (!modal) return;

        modal.dataset.next = nextUrl || 'pages/agendamento.html';
        modal.classList.add('modal-open');
        modal.setAttribute('aria-hidden', 'false');
    }

    function fecharModal() {
        if (!modal) return;

        modal.classList.remove('modal-open');
        modal.setAttribute('aria-hidden', 'true');
        delete modal.dataset.next;
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (
                e.target.classList.contains('modal-backdrop') ||
                e.target.classList.contains('modal-close')
            ) {
                fecharModal();
            }
        });
    }

    if (modalLoginBtn) {
        modalLoginBtn.addEventListener('click', () => {
            const next = modal?.dataset?.next || 'pages/agendamento.html';
            window.location.href =
                'pages/login.html?next=' + encodeURIComponent(next);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') fecharModal();
    });

    // Garantia: ao carregar, modal SEMPRE inicia fechado e sem inline style
    document.addEventListener('DOMContentLoaded', () => {
        if (!modal) return;
        modal.classList.remove('modal-open');
        modal.removeAttribute('style'); // <- ESSA LINHA resolve o overlay preso
        modal.setAttribute('aria-hidden', 'true');
    });

    /* =====================================
       EFEITO DO HEADER NO SCROLL
    ===================================== */
    const header = document.querySelector('header');

    if (header) {
        window.addEventListener('scroll', () => {
            header.style.backgroundColor =
                window.scrollY > 50 ? '#000' : 'rgba(0, 0, 0, 0.9)';
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');
    const menuLinks = document.querySelectorAll('.nav-links a');
    if (hamburgerBtn && navMenu) {
        
        // Abrir & Fechar ao clicar no botão
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

         // Fechar automaticamente ao clicar em um link
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Fechar ao clicar fora do menu
        document.addEventListener('click', (e) => {
            if (!hamburgerBtn.contains(e.target) && 
                !navMenu.contains(e.target) && 
                navMenu.classList.contains('active')) {
                
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});