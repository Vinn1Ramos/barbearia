// getBarbeiros.js

function waitForAuthReady() {
  return new Promise((resolve) => {
    const unsub = firebase.auth().onAuthStateChanged((user) => {
      unsub();          // evita ficar ouvindo pra sempre
      resolve(user);    // pode ser null se não estiver logado
    });
  });
}

window.consultBarbeiros = async function consultBarbeiros() {
  const API = "https://spoutless-catarina-immusically.ngrok-free.dev";

  // ✅ Aguarda o Firebase terminar de carregar o usuário
  const user = firebase.auth().currentUser || await waitForAuthReady();
  if (!user) throw new Error("Usuário não autenticado.");

  const idToken = await user.getIdToken();

  const res = await fetch(`${API}/barbeiros`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${idToken}`,
      "ngrok-skip-browser-warning": "true"
    },
  });

  // Se a API falhar e não retornar JSON válido, não quebra o código
  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    console.error("Erro API:", data);
    throw new Error(data?.error?.message || "Erro ao buscar barbeiros");
  }

  return Array.isArray(data) ? data : [];
};
