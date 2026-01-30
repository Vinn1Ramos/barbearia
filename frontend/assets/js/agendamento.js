/*aguarda pagina carregar, monitora mudanças no input*/
document.addEventListener('DOMContentLoaded', async () => {

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
    // BARBEIRO
    // ============================
    // agendamento.js


    try {
        const barbeiros = await window.consultBarbeiros();

        const select = document.getElementById("barbeiro"); 

        // limpa e adiciona placeholder
        select.innerHTML = '<option value="">Selecione um barbeiro</option>';

        barbeiros.forEach((b) => {
            const opt = document.createElement("option");
            opt.value = b.id;     
            opt.textContent = b.nome || b.name;     
            select.appendChild(opt);
        });

    } catch (err) {
        console.error(err);
        // opcional: mostrar mensagem visual ao usuário
    }


    // ============================
    // DATA E HORA - CONTROLE TOTAL
    // ============================
    const barbeiroSelect = document.getElementById('barbeiro');
    const dataInput = document.getElementById('data');
    const horaInput = document.getElementById('hora');
    const calendarioGrid = document.getElementById('agendamento-calendario');
    const calendarioMes = document.querySelector('.agendamento-data__month');
    const calendarioNavs = document.querySelectorAll('.agendamento-data__nav');
    const meses = [
        "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
    let mesAtual = new Date();
    mesAtual.setDate(1);

    const renderCalendario = () => {
        if (!calendarioGrid || !calendarioMes || !dataInput) return;

        const ano = mesAtual.getFullYear();
        const mes = mesAtual.getMonth();
        calendarioMes.textContent = `${meses[mes]} ${ano}`;
        calendarioGrid.innerHTML = "";

        diasSemana.forEach(dia => {
            const dow = document.createElement('div');
            dow.className = 'agendamento-data__dow';
            dow.textContent = dia;
            calendarioGrid.appendChild(dow);
        });

        const primeiroDia = new Date(ano, mes, 1);
        const startIndex = (primeiroDia.getDay() + 6) % 7;
        for (let i = 0; i < startIndex; i++) {
            const empty = document.createElement('div');
            empty.className = 'agendamento-data__empty';
            calendarioGrid.appendChild(empty);
        }

        const totalDias = new Date(ano, mes + 1, 0).getDate();
        const minDate = dataInput.min ? new Date(`${dataInput.min}T00:00`) : null;
        const hojeLocal = new Date();
        hojeLocal.setHours(0, 0, 0, 0);
        const selecionada = dataInput.value ? new Date(`${dataInput.value}T00:00`) : null;

        for (let dia = 1; dia <= totalDias; dia++) {
            const data = new Date(ano, mes, dia);
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'agendamento-data__day';
            btn.textContent = String(dia);
            btn.dataset.date = data.toISOString().split('T')[0];

            if (minDate && data < minDate) {
                btn.classList.add('is-disabled');
                btn.disabled = true;
            }

            if (selecionada && data.getTime() === selecionada.getTime()) {
                btn.classList.add('is-selected');
            }

            if (data.getTime() === hojeLocal.getTime()) {
                btn.classList.add('is-today');
            }

            btn.addEventListener('click', () => {
                if (btn.disabled) return;
                dataInput.value = btn.dataset.date;
                dataInput.dispatchEvent(new Event('change', { bubbles: true }));
            });

            calendarioGrid.appendChild(btn);
        }
    };

    calendarioNavs.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            if (action === 'prev') {
                mesAtual.setMonth(mesAtual.getMonth() - 1);
            } else {
                mesAtual.setMonth(mesAtual.getMonth() + 1);
            }
            renderCalendario();
        });
    });
    dataInput.addEventListener('change', async () => {
        if (!dataInput.value) {
            horaInput.disabled = true;
            horaInput.value = "";
            horaInput.innerHTML = '<option value="">Selecione um horario</option>';
            limparHorarioChips();
            setHorarioChipsDisabled(true);
            return;
        }
        // Coleta horarios ja marcados na data selecionada
        const agendamentos = await window.consultAgendamentos(new Date(dataInput.value).toISOString(), parseInt(barbeiroSelect.value));
        const horarios = agendamentos.map(ag => ({
            horaInicio: ag.horaInicio,
            horaFim: ag.horaFim
        }))
        const horariosList = []
        horarios.forEach(h => {
            horariosList.push([converterParaMinutos(h.horaInicio), converterParaMinutos(h.horaFim)])
        })

        const dataSelecionada = new Date(`${dataInput.value}T00:00`);
        mesAtual = new Date(dataSelecionada.getFullYear(), dataSelecionada.getMonth(), 1);
        renderCalendario();
        gerarHorariosDisponiveis(dataInput.value, horariosList);
    });

    barbeiroSelect.addEventListener('change', async () => {
    // Coleta horarios ja marcados na data selecionada
    const agendamentos = await window.consultAgendamentos(new Date(dataInput.value).toISOString(), parseInt(barbeiroSelect.value));
    const horarios = agendamentos.map(ag => ({
        horaInicio: ag.horaInicio,
        horaFim: ag.horaFim
    }))
    const horariosList = []
    horarios.forEach(h => {
        horariosList.push([converterParaMinutos(h.horaInicio), converterParaMinutos(h.horaFim)])
    })

    const dataSelecionada = new Date(`${dataInput.value}T00:00`);
    mesAtual = new Date(dataSelecionada.getFullYear(), dataSelecionada.getMonth(), 1);
    gerarHorariosDisponiveis(dataInput.value, horariosList);
    });


    // começa bloqueado
    horaInput.disabled = true;

    // data mínima = hoje
    const hoje = new Date();
    const hojeISO = hoje.toISOString().split('T')[0];
    dataInput.setAttribute('min', hojeISO);
    renderCalendario();

    // sempre que mudar a data
    dataInput.addEventListener('change', async () => {

        if (!dataInput.value) {
            horaInput.disabled = true;
            horaInput.value = "";
            limparHorarioChips();
            setHorarioChipsDisabled(true);
            return;
        }

        horaInput.disabled = false;
        setHorarioChipsDisabled(false);

        const agora = new Date();

        // 🔥 agora usamos a variável GLOBAL
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
            atualizarChipsSelecionados("");
        }
    });

    // valida toda mudança de hora
    horaInput.addEventListener('change', () => {

        if (!dataInput.value) {
            alert("Selecione a data antes de escolher o horário.");
            horaInput.value = "";
            horaInput.disabled = true;
            setHorarioChipsDisabled(true);
            return;
        }

        const hora = horaInput.value;
        atualizarChipsSelecionados(hora);

        if (!hora) return;

        const dataHoraEscolhida = new Date(`${dataInput.value}T${hora}`);
        const agoraDataHora = new Date();

        // ❌ bloqueia qualquer horário no passado
        if (dataHoraEscolhida < agoraDataHora) {
            alert("Não é permitido escolher um horário anterior ao momento atual.");
            horaInput.value = "";
            atualizarChipsSelecionados("");
            return;
        }
    });

    // ============================
    // BOTÃO AGENDAR
    // ============================
    const agendarBtn = document.getElementById('agendarBtn');
    console.log(document.getElementById('barbeiro').value)

    agendarBtn.addEventListener('click', async () => {

        if (!servicoSelecionado) {
            alert("Selecione um serviço.");
            return;
        }
        if (barbeiroSelect && !barbeiroSelect.value) {
            alert("Selecione um barbeiro.");
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
        const duracao = converterParaMinutos(horaInput.value) + service.duracao_minutos
        const horaFinal = formatarTempo(duracao)

        const agendamentoData = {
            usuario_id: user.id,
            servico_id: service.id,
            barbeiro_id: parseInt(barbeiroSelect.value),
            data: new Date(dataInput.value).toISOString(),
            horaInicio: horaInput.value + ':00',
            horaFim: horaFinal + ':00',
            status: 'pendente',
            criado_em: new Date().toISOString()
        };

        await window.registerAgendamento(agendamentoData)
    });
});

function gerarHorariosDisponiveis(dataSelecionada, horarios) {
    const selectHora = document.getElementById('hora');
    const chipsContainer = document.getElementById('agendamento-horarios');
    selectHora.innerHTML = '<option value="">Selecione um horario</option>';
    limparHorarioChips();
    setHorarioChipsDisabled(false);

    const inicio = 9 * 60;   // 09:00 em minutos
    const fim = 18 * 60;     // 18:00 em minutos
    const intervalo = 15;

    const agora = new Date();
    const hojeISO = agora.toISOString().split('T')[0];

    for (let minutos = inicio; minutos <= fim; minutos += intervalo) {
        const h = String(Math.floor(minutos / 60)).padStart(2, '0');
        const m = String(minutos % 60).padStart(2, '0');
        const horaStr = `${h}:${m}`;
        const minutosStr = converterParaMinutos(horaStr)

        // Se a data for hoje, bloqueia horarios passados
        if (dataSelecionada === hojeISO) {
            const dataHora = new Date(`${dataSelecionada}T${horaStr}`);
            if (dataHora <= agora) continue;
        }

        if (!horarios || horarios.length === 0) {
            const option = document.createElement('option');
            option.value = horaStr;
            option.textContent = horaStr;
            selectHora.appendChild(option);

            if (chipsContainer) {
                const chip = document.createElement('button');
                chip.type = 'button';
                chip.className = 'agendamento-horario__chip';
                chip.dataset.value = horaStr;
                chip.textContent = horaStr;
                chip.addEventListener('click', () => {
                    selectHora.value = horaStr;
                    atualizarChipsSelecionados(horaStr);
                    selectHora.dispatchEvent(new Event('change', { bubbles: true }));
                });
                chipsContainer.appendChild(chip);
            }
        }

        let c = 0
        horarios.forEach(h => {
            c++
            if (minutosStr >= h[0] && minutosStr < h[1]) {
                return
            } else {
                if (c === horarios.length) {
                    const option = document.createElement('option');
                    option.value = horaStr;
                    option.textContent = horaStr;
                    selectHora.appendChild(option);

                    if (chipsContainer) {
                        const chip = document.createElement('button');
                        chip.type = 'button';
                        chip.className = 'agendamento-horario__chip';
                        chip.dataset.value = horaStr;
                        chip.textContent = horaStr;
                        chip.addEventListener('click', () => {
                            selectHora.value = horaStr;
                            atualizarChipsSelecionados(horaStr);
                            selectHora.dispatchEvent(new Event('change', { bubbles: true }));
                        });
                        chipsContainer.appendChild(chip);
                    }
                }
            }
        })
    }

    selectHora.disabled = false;
}

function atualizarChipsSelecionados(valor) {
    const chipsContainer = document.getElementById('agendamento-horarios');
    if (!chipsContainer) return;

    const chips = chipsContainer.querySelectorAll('.agendamento-horario__chip');
    chips.forEach(chip => {
        chip.classList.toggle('is-selected', chip.dataset.value === valor);
    });
}

function limparHorarioChips() {
    const chipsContainer = document.getElementById('agendamento-horarios');
    if (!chipsContainer) return;
    chipsContainer.innerHTML = '';
}

function setHorarioChipsDisabled(isDisabled) {
    const chipsContainer = document.getElementById('agendamento-horarios');
    if (!chipsContainer) return;
    chipsContainer.classList.toggle('is-disabled', isDisabled);
}

function converterParaMinutos(strHoras) {
    if (!strHoras) {
        throw new Error("Horário inválido: valor vazio");
    }

    // força para string
    const horaStr = String(strHoras);

    if (!horaStr.includes(":")) {
        throw new Error("Formato de hora inválido: " + horaStr);
    }

    const [horas, minutos] = horaStr.split(":").map(Number);

    if (isNaN(horas) || isNaN(minutos)) {
        throw new Error("Hora ou minuto inválido: " + horaStr);
    }

    return horas * 60 + minutos;
}

function formatarTempo(totalMinutos) {
    let horas = Math.floor(totalMinutos / 60); // Pega a parte inteira das horas
    let minutosRestantes = totalMinutos % 60; // Pega o restante dos minutos

    // Adiciona um zero à esquerda se for menor que 10
    horas = horas < 10 ? '0' + horas : horas;
    minutosRestantes = minutosRestantes < 10 ? '0' + minutosRestantes : minutosRestantes;

    return `${horas}:${minutosRestantes}`;
}