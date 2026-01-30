// getServices.js
window.consultService = async function consultService() {
  const user = firebase.auth().currentUser || await waitForAuthReady();
  if (!user) throw new Error("Usuário não autenticado.");

  const idToken = await user.getIdToken();

  const res = await fetch(`${API}/servicos`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${idToken}`,
      "ngrok-skip-browser-warning": "true"
    }
  });

  let data;
  try { data = await res.json(); } catch { data = null; }

  if (!res.ok) {
    console.error("Erro API:", data);
    throw new Error(data?.error?.message || "Erro ao buscar serviços");
  }

  return Array.isArray(data) ? data : [];
};
