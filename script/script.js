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
    alert("Redirecionando para o sistema de agendamento...");
    // Aqui você pode colocar o link do WhatsApp ou abrir um formulário
}