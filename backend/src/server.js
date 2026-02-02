import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);

app.listen(3000, () => {
  console.log("🚀 Backend rodando na porta 3000");
});


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

// Controle do avanço
let culto = [];
let indexAtual = 0;

// Atualiza o programa
app.post("/culto", (req, res) => {
  const { momentos } = req.body;

  if (!Array.isArray(momentos) || momentos.length === 0) {
    return res.status(400).json({
      error: "Lista de momentos inválida"
    });
  }

  culto = momentos;
  indexAtual = 0;

  res.json({
    message: "Programa do culto atualizado",
    totalMomentos: culto.length
  });
});

// Mostra o momento atual do culto
app.get("/hub", (req, res) => {
  res.json({
    atual: culto[indexAtual] || "",
    proximo: culto[indexAtual + 1] || "",
    proximos: culto[indexAtual + 2] || ""
  });
});

// Avança o momento
app.post("/avancar", (req, res) => {
  if (indexAtual < culto.length - 1) {
    indexAtual++;
  }

  res.json({ ok: true });
});
