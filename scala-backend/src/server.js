const express = require("express");

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

// Programa do culto
const culto = [
  "João Cantando",
  "Palavra",
  "Leitura bíblica",
  "Ofertório",
  "Mensagem",
  "Apelo",
  "Encerramento"
];

let indexAtual = 0;

// Leitura do front
app.get("/hub", (req, res) => {
  res.json({
    atual: culto[indexAtual],
    proximo: culto[indexAtual + 1] || "",
    proximos: culto[indexAtual + 2] || ""
  });
});

// painel de avançar
app.post("/avancar", (req, res) => {
  if (indexAtual < culto.length - 1) {
    indexAtual++;
  }

  res.json({
    ok: true,
    atual: culto[indexAtual]
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/hub`);
});
