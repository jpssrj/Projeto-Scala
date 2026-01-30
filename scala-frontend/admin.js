function carregar() {
  fetch("http://localhost:3000/hub")
    .then(res => {
      if(!res.ok) {
        throw new Error("Erro ao buscar estado");
      }
      return res.json();
    })
    .then(data => {
      document.getElementById("momento-atual").innerText = 
        "Agora: " + data.atual;
    })
    .catch(() => {
      document.getElementById("momento-atual").innerText = 
        "⚠️ Servidor Desconectado";
    });
}

function avancar() {
  const btn = document.getElementById("btn-avancar");
  btn.disabled = true;

  fetch("http://localhost:3000/avancar", {
    method: "POST"
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("⚠️ Erro ao avançar");
      }
    })
    .then(() => carregar())
    .catch(() => {
      alert("⚠️ Erro ao avançar momento");
    })
    .finally(() => {
      btn.disabled = false;
    });
}

function salvarCulto() {
  const texto = document.getElementById("programa").value;

  const momentos = texto
    .split("\n")
    .map(l => l.trim())
    .filter(l => l !== "");

  fetch("http://localhost:3000/culto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ momentos })
  })
    .then(res => res.json())
    .then(() => {
      alert("Programa do culto salvo com sucesso!");
      carregar();
    })
    .catch(() => {
      alert("Erro ao salvar o culto");
    });
}


carregar();