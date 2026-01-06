// Efeito de mudar a cor da navbar ao rolar a página
window.addEventListener('scroll', function() {
    const nav = document.querySelector('header');
    if (window.scrollY > 50) {
        nav.style.backgroundColor = '#000';
    } else {
        nav.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    }
});

function abrirAgendamento() {
    // Abre o chat do WhatsApp em nova aba com mensagem pré-preenchida
    const waUrl = "https://wa.me/5132472310?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20hor%C3%A1rio%20na%20Ramos%20Barbearia.%20Meu%20nome%20%3A%20%5Bseu%20nome%5D.";
    window.open(waUrl, '_blank');
}