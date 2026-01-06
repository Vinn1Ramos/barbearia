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
loginRadiusV2.util.ready = function(callback) {
    if (/complete|interactive|loaded/.test(document.readyState)) {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', callback);
    }
};

/* Inicializa a configuração do SDK LoginRadius — comente/remova se não for utilizado */
loginRadiusV2.util.ready(function() {
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
        LoginRadiusSDK.login({ email: email, password: password }, function(response) {
            localStorage.setItem('token', response.access_token);
            // redireciona para `next` se presente na query string
            var params = new URLSearchParams(window.location.search);
            var next = params.get('next');
            if (next) {
                try { window.location.href = decodeURIComponent(next); }
                catch (e) { window.location.href = next; }
            } else {
                window.location.href = '/dashboard.html';
            }
        }, function(error) {
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
        }, function(response) {
            alert('Conta criada com sucesso!');
            window.location.href = 'login.html';
        }, function(error) {
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
    var cta = document.querySelector('.hero .cta-agendar');
    if (!cta) return;

    cta.addEventListener('click', function(e) {
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

/* declarar handlers uma vez no escopo do arquivo */
var _backdropHandler = null;
var _escHandler = null;

/* Ao abrir o modal: adiciona classes no modal e no body (ativa desfoque) */
function showLoginModal(nextUrl) {
  var modal = document.getElementById('login-modal');
  if (!modal) return;
  modal.classList.add('modal-open');             // habilita pointer-events no modal
  modal.setAttribute('aria-hidden', 'false');

  document.body.classList.add('modal-active');   // aplica o blur na página

  var loginBtn = document.getElementById('modal-login-btn');
  var closeBtn = document.getElementById('modal-close-btn');
  var backdrop = modal.querySelector('.modal-backdrop');

  function onLogin() { window.location.href = 'functions/login.html?next=' + encodeURIComponent(nextUrl || '/'); }
  function onClose() { hideLoginModal(); }

  if (loginBtn) loginBtn.addEventListener('click', onLogin, { once: true });
  if (closeBtn) closeBtn.addEventListener('click', onClose, { once: true });

  _backdropHandler = function() { hideLoginModal(); };
  if (backdrop) backdrop.addEventListener('click', _backdropHandler);

  _escHandler = function(e) { if (e.key === 'Escape') hideLoginModal(); };
  document.addEventListener('keydown', _escHandler);
}

/* Ao fechar: remove classes e listeners */
function hideLoginModal() {
  var modal = document.getElementById('login-modal');
  if (!modal) return;
  modal.classList.remove('modal-open');
  modal.setAttribute('aria-hidden', 'true');

  document.body.classList.remove('modal-active'); // remove blur

  var backdrop = modal.querySelector('.modal-backdrop');
  if (backdrop && _backdropHandler) {
    backdrop.removeEventListener('click', _backdropHandler);
    _backdropHandler = null;
  }
  if (_escHandler) {
    document.removeEventListener('keydown', _escHandler);
    _escHandler = null;
  }
}