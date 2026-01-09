
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
       CARREGAMENTO DE SERVIÇOS
    ===================================== */
/*   const servicesGrid = document.getElementById('services-grid');

    if (servicesGrid) {
        fetch('http://localhost:3000/servicos')
            .then(res => res.json())
            .then(servicos => {
                servicesGrid.innerHTML = '';

                servicos.forEach(servico => {
                    const card = document.createElement('div');
                    card.className = 'service-card red-card';

                    card.innerHTML = `
                        <i class="fa-solid fa-scissors"></i>
                        <h3>${servico.nome}</h3>
                        <p>${servico.descricao || 'Serviço premium Ramos Barbearia'}</p>
                        <strong>R$ ${servico.preco}</strong>
                    `;

                    servicesGrid.appendChild(card);
                });
            })
            .catch(() => {
                servicesGrid.innerHTML = '<p>Erro ao carregar serviços.</p>';
            });
    }
*/
    /* =====================================
       PROTEÇÃO DO BOTÃO "AGENDAR"
    ===================================== */
   document.addEventListener('click', (e) => {
        const btn = e.target.closest('.cta-agendar');
        if (!btn) return;

        if (!localStorage.getItem('token')) {
            e.preventDefault();
            abrirModal(btn.getAttribute('href'));
        }
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
        modal.style.visibility = 'visible';
        modal.style.pointerEvents = 'auto';
    }

    function fecharModal() {
        if (!modal) return;

        modal.classList.remove('modal-open');
        modal.style.visibility = 'hidden';
        modal.style.pointerEvents = 'none';
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
            const next = modal.dataset.next || 'pages/agendamento.html';
            window.location.href =
                'pages/login.html?next=' + encodeURIComponent(next);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') fecharModal();
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
