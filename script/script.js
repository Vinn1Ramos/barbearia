/* script/script.js
 * Arquivo principal de comportamentos JS para a página estática
 * - Efeito visual do header ao rolar
 * - Integração mínima com LoginRadius para login/cadastro (exemplo)
 */
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