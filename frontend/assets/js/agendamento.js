/*aguarda pagina carregar, monitora mudanças no input*/
document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // CONTROLE DE USUÁRIO LOGADO
    // ============================
    let usuarioLogado = null;

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            usuarioLogado = user;
        } else {
            alert("Você precisa estar logado para acessar esta página.");
            window.location.href = "login.html";
        }
    });

    let dataEscolhida = null;   // ✅ variável global
    let hojeData = null;       // ✅ usada depois no botão

    //Seleciona o serviço
    let servicoSelecionado = "";

    const cards = document.querySelectorAll('.servico-card');

    cards.forEach(card => {
        const input = card.querySelector('input');

        card.addEventListener('click', () => {
            // marca o radio
            input.checked = true;

            // salva valor
            servicoSelecionado = input.value;

            // visual ativo
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });

    // ============================
    // DATA E HORA - CONTROLE TOTAL
    // ============================

    const dataInput = document.getElementById('data');
    const horaInput = document.getElementById('hora');
    dataInput.addEventListener('change', () => {
        if (!dataInput.value) {
            horaInput.disabled = true;
            horaInput.innerHTML = '<option value="">Selecione um horário</option>';
            return;
        }

        gerarHorariosDisponiveis(dataInput.value);
    });


    // começa bloqueado
    horaInput.disabled = true;

    // data mínima = hoje
    const hoje = new Date();
    const hojeISO = hoje.toISOString().split('T')[0];
    dataInput.setAttribute('min', hojeISO);

    // sempre que mudar a data
    dataInput.addEventListener('change', async () => {
        
        // Coleta horarios ja marcados na data selecionada
        const agendamentos = await window.consultAgendamentos(new Date(dataInput.value).toISOString())
        console.log('agendamentos: ' + JSON.stringify(agendamentos))

        if (!dataInput.value) {
            horaInput.disabled = true;
            horaInput.value = "";
            return;
        }

        horaInput.disabled = false;

        const agora = new Date();

        // agora usamos a variável GLOBAL
        dataEscolhida = new Date(dataInput.value + "T00:00");

        hojeData = new Date();
        hojeData.setHours(0, 0, 0, 0);

        let minHora = "09:00";
        const maxHora = "18:00";

        // se a data for hoje → mínimo = agora
        if (dataEscolhida.getTime() === hojeData.getTime()) {
            const h = String(agora.getHours()).padStart(2, '0');
            const m = String(agora.getMinutes()).padStart(2, '0');
            minHora = `${h}:${m}`;
        }

        horaInput.setAttribute('min', minHora);
        horaInput.setAttribute('max', maxHora);

        // se já houver valor inválido, limpa
        if (horaInput.value && horaInput.value < minHora) {
            horaInput.value = "";
        }
    });

    // valida toda mudança de hora
    horaInput.addEventListener('change', () => {

        if (!dataInput.value) {
            alert("Selecione a data antes de escolher o horário.");
            horaInput.value = "";
            horaInput.disabled = true;
            return;
        }

        const hora = horaInput.value;

        if (!hora) return;

        const dataHoraEscolhida = new Date(`${dataInput.value}T${hora}`);
        const agoraDataHora = new Date();

        // ❌ bloqueia qualquer horário no passado
        if (dataHoraEscolhida < agoraDataHora) {
            alert("Não é permitido escolher um horário anterior ao momento atual.");
            horaInput.value = "";
            return;
        }
    });

    // ============================
    // BOTÃO AGENDAR
    // ============================
    const agendarBtn = document.getElementById('agendarBtn');

    agendarBtn.addEventListener('click', async () => {

        if (!servicoSelecionado) {
            alert("Selecione um serviço.");
            return;
        }

        if (!dataInput.value || !horaInput.value) {
            alert("Selecione data e horário.");
            return;
        }

        if (!usuarioLogado) {
            alert("Você precisa estar logado.");
            return;
        }

        const dataHoraEscolhida = new Date(`${dataInput.value}T${horaInput.value}`);
        const agoraDataHora = new Date();

        // ✅ agora dataEscolhida e hojeData EXISTEM
        if (dataEscolhida && hojeData) {
            if (dataEscolhida.getTime() === hojeData.getTime()) {
                if (dataHoraEscolhida < agoraDataHora) {
                    alert("Não é permitido escolher um horário anterior ao momento atual.");
                    return;
                }
            }
        }
        const user = await window.consultUserId()

        const service = await window.consultServiceId(servicoSelecionado)

        const agendamentoData = {
            usuario_id: user.id,
            servico_id: service.id,
            barbeiro_id: 1,
            data: new Date(dataInput.value).toISOString(),
            hora: horaInput.value + ':00',
            status: 'pendente',
            criado_em: new Date().toISOString()
        };

        await window.registerAgendamento(agendamentoData)
    });
});

function gerarHorariosDisponiveis(dataSelecionada) {
    const selectHora = document.getElementById('hora');
    selectHora.innerHTML = '<option value="">Selecione um horário</option>';

    const inicio = 9 * 60;   // 09:00 em minutos
    const fim = 18 * 60;     // 18:00 em minutos
    const intervalo = 15;

    const agora = new Date();
    const hojeISO = agora.toISOString().split('T')[0];

    for (let minutos = inicio; minutos <= fim; minutos += intervalo) {
        const h = String(Math.floor(minutos / 60)).padStart(2, '0');
        const m = String(minutos % 60).padStart(2, '0');
        const horaStr = `${h}:${m}`;
 
        // Se a data for hoje, bloqueia horários passados
        if (dataSelecionada === hojeISO) {
            const dataHora = new Date(`${dataSelecionada}T${horaStr}`);
            if (dataHora <= agora) continue;
        }

        const option = document.createElement('option');
        option.value = horaStr;
        option.textContent = horaStr;
        selectHora.appendChild(option);
    }

    selectHora.disabled = false;
}
