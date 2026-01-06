/*
 * Efeito de mudar a cor da navbar ao rolar a página
 * Descrição: adiciona um listener de scroll que altera a cor de fundo do elemento <header>
 * Uso: mantém a navbar visível em rolagens longas
 */
window.addEventListener('scroll', function() {
    const nav = document.querySelector('header');
    if (window.scrollY > 50) {
        nav.style.backgroundColor = '#000';
    } else {
        nav.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    }
});

/*
 * LoginRadius (autenticação)
 * Nota: configuração mantendo os valores originais; se não usar LoginRadius remova/oculte essas chaves
 * As credenciais abaixo estão presentes no repositório — considere movê-las para variáveis de ambiente
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
    LoginRadiusSDK.setLoginRadiusConfig("ramosbarbearia", {
        hashKey: "1f40c717-bc79-4ea4-a7d6-8e22db12788c", // TODO: mover para ambiente seguro
        apiKey: "sidzrYtYiLtOZ4AQMH5bYMGqVciYeR5MdNe8BHu7yZM", // TODO: mover para ambiente seguro
        v2Flows: true
    });
});
