/* Envio do formulário*/
document.getElementById('form-agendamento').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Captura dos dados

    const id_servico = document.getElementById('servico').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;

    //validando se os dados estao sendo lidos corretamente
    console.log({ id_servico, data, hora });
});