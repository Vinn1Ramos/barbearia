/* script/script.js
 * Comportamentos JS principais
 * - Efeito visual do header ao rolar
 * - Handlers de login/registro (integração LoginRadius - exemplo)
 * - Bloqueio do CTA 'Agendar' para usuários não autenticados com modal personalizado
 */

// Scroll: altera o fundo do header ao rolar a página
function handleScroll() {
    const nav = document.querySelector('header');
    if (!nav) return;
    if (window.scrollY > 50) {
        nav.style.backgroundColor = '#000';
    } else {
        nav.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    }
};


window.addEventListener('scroll', handleScroll);

/* LoginRadius (autenticação)
 * Nota: valores mantidos do repositório; remova ou mova para variáveis de ambiente em produção.
 */
var loginRadiusV2 = loginRadiusV2 || {};
loginRadiusV2.util = loginRadiusV2.util || {};
loginRadiusV2.util.ready = function (callback) {
    if (/complete|interactive|loaded/.test(document.readyState)) {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', callback);
    }
};

/* Inicializa a configuração do SDK LoginRadius — comente/remova se não for utilizado */
loginRadiusV2.util.ready(function () {
    if (typeof LoginRadiusSDK !== 'undefined' && LoginRadiusSDK.setLoginRadiusConfig) {
        LoginRadiusSDK.setLoginRadiusConfig('ramosbarbearia', {
            hashKey: '1f40c717-bc79-4ea4-a7d6-8e22db12788c', // TODO: mover para ambiente seguro
            apiKey: 'sidzrYtYiLtOZ4AQMH5bYMGqVciYeR5MdNe8BHu7yZM', // TODO: mover para ambiente seguro
            v2Flows: true
        });
    }

    // inicializações que dependem do DOM
    requireLoginForAgendar();
});

/* Handlers de formulário: login e registro (aplicam-se se os formulários existirem na página) */
function handleLoginSubmit(e) {
    e.preventDefault();

    var email = document.getElementById('login-email')?.value;
    var password = document.getElementById('login-password')?.value;

    if (typeof LoginRadiusSDK !== 'undefined' && LoginRadiusSDK.login) {
        LoginRadiusSDK.login({ email: email, password: password }, function (response) {
            localStorage.setItem('token', response.access_token);
            // redireciona para `next` se presente na query string
            var params = new URLSearchParams(window.location.search);
            try { delete document.getElementById('login-modal').dataset.next; } catch(e) {}
            if (next) {
                try { window.location.href = decodeURIComponent(next); }
                catch (e) { window.location.href = next; }
            } else {
                window.location.href = '/dashboard.html';
            }
        }, function (error) {
            alert(error.Description || 'Erro no login');
        });
    } else {
        alert('Login SDK não disponível.');
    }
}

var _loginForm = document.getElementById('login-form');
if (_loginForm) _loginForm.addEventListener('submit', handleLoginSubmit);

function handleRegisterSubmit(e) {
    e.preventDefault();

    if (typeof LoginRadiusSDK !== 'undefined' && LoginRadiusSDK.register) {
        LoginRadiusSDK.register({
            email: document.getElementById('reg-email')?.value,
            password: document.getElementById('reg-password')?.value,
            firstName: document.getElementById('reg-name')?.value
        }, function (response) {
            alert('Conta criada com sucesso!');
            window.location.href = 'login.html';
        }, function (error) {
            alert(error.Description || 'Erro no cadastro');
        });
    } else {
        alert('Register SDK não disponível.');
    }
}

var _registerForm = document.getElementById('register-form');
if (_registerForm) _registerForm.addEventListener('submit', handleRegisterSubmit);

/* Bloqueio do CTA 'Agendar agora' - mostra modal se usuário não autenticado */
function requireLoginForAgendar() {
    var cta = document.querySelector('.cta-agendar');
    if (!cta) return;

    cta.addEventListener('click', function (e) {
        var token = localStorage.getItem('token');
        if (!token) {
            e.preventDefault();
            // calcula destino (path) e abre modal com parâmetro next
            var href = cta.getAttribute('href') || '';
            var next = href.startsWith('http') ? href : (href.startsWith('/') ? href : '/' + href);
            showLoginModal(next);
        }
    });
}

/* handlers armazenados no escopo do arquivo */
var _backdropHandler = null;
var _escHandler = null;

function showLoginModal(nextUrl) {
    var modal = document.getElementById('login-modal');
    modal.dataset.next = nextUrl || '/';
    if (!modal) return;
    modal.classList.add('modal-open');
    modal.setAttribute('aria-hidden', 'false');
    var loginBtn = document.getElementById('modal-login-btn');
    var closeBtn = document.getElementById('modal-close-btn');
    var backdrop = modal.querySelector('.modal-backdrop');
    function onLogin() {
        window.location.href = 'functions/login.html?next=' + encodeURIComponent(nextUrl || '/');
    }
    function onClose() {
        hideLoginModal();
    }
    if (loginBtn) loginBtn.addEventListener('click', onLogin, { once: true });
    if (closeBtn) closeBtn.addEventListener('click', onClose, { once: true });
    _backdropHandler = function () { hideLoginModal(); };
    if (backdrop) backdrop.addEventListener('click', _backdropHandler);
    _escHandler = function (e) { if (e.key === 'Escape') hideLoginModal(); };
    document.addEventListener('keydown', _escHandler);
}

function hideLoginModal() {
    var modal = document.getElementById('login-modal');
    if (!modal) return;
    modal.classList.remove('modal-open');
    modal.setAttribute('aria-hidden', 'true');

    var backdrop = modal.querySelector('.modal-backdrop');
    if (backdrop && _backdropHandler) {
        backdrop.removeEventListener('click', _backdropHandler);
        _backdropHandler = null;
    }
    if (_escHandler) {
        // remover somente o listener correto
        document.removeEventListener('keydown', _escHandler);
        _escHandler = null;
    }
}

// Delegação de clique para fechar/entrar no modal (fallback robusto)
document.addEventListener('click', function(e) {
  var target = e.target;

  // fecha se clicou no X ou em elemento com classe .modal-close (ou botão cancelar)
  if (target.closest && (target.closest('#modal-close-btn') || target.closest('.modal-close') || target.closest('#modal-cancel-btn'))) {
    e.preventDefault();
    try { hideLoginModal(); } catch (err) { console.warn('hideLoginModal falhou', err); }
    return;
  }

  // fecha se clicou no backdrop
  if (target.closest && target.closest('.modal-backdrop')) {
    e.preventDefault();
    try { hideLoginModal(); } catch (err) { console.warn('hideLoginModal falhou', err); }
    return;
  }

  // Entrar — usa o data-next gravado no modal
  if (target.closest && target.closest('#modal-login-btn')) {
    e.preventDefault();
    var modal = document.getElementById('login-modal');
    var next = (modal && modal.dataset && modal.dataset.next) ? modal.dataset.next : '/';
    window.location.href = 'functions/login.html?next=' + encodeURIComponent(next);
    return;
  }
});