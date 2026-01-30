window.consultAgendamentos = async function consultAgendamentos(dataISO, barbeiroId) {
    const user = firebase.auth().currentUser;
    const API = "https://spoutless-catarina-immusically.ngrok-free.dev";
    if (!user) throw new Error("Usuário não autenticado.");

    const idToken = await user.getIdToken();

    const filter = encodeURIComponent(JSON.stringify({
        "where": {
            "data": dataISO,
            "barbeiro_id": barbeiroId
        }
    }));

    const res = await fetch(`${API}/agendamentos?filter=${filter}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
            "ngrok-skip-browser-warning": "true"
        },
    });

    const data = await res.json().catch(() => ([]));

    if (!res.ok) {
        console.error("Erro API:", data);
        throw new Error(data?.error?.message || "Erro ao buscar agendamentos");
    }
    return Array.isArray(data) ? data : [];
};
