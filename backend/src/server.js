import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import userRoutes from "./routes/user.routes.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Permite o frontend conectar de qualquer lugar
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());
app.use("/users", userRoutes);

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Controle do avanço
let culto = [];
let indexAtual = 0;
let microfonesAtual = []; // Mics ativos no momento atual
let microfonesProximo = []; // Mics configurados para o próximo momento

// Função auxiliar para notificar todos os painéis
function broadcastUpdate() {
  io.emit("update-hub", {
    atual: culto[indexAtual] || "",
    proximo: culto[indexAtual + 1] || "",
    proximos: culto[indexAtual + 2] || "",
    microfones: microfonesAtual,
    microfonesProximo: microfonesProximo
  });
}

// Quando um novo painel conecta, mandamos o status atual logo de cara
io.on("connection", (socket) => {
  console.log("Um novo painel se conectou:", socket.id);
  
  socket.emit("update-hub", {
    atual: culto[indexAtual] || "",
    proximo: culto[indexAtual + 1] || "",
    proximos: culto[indexAtual + 2] || "",
    microfones: microfonesAtual,
    microfonesProximo: microfonesProximo
  });

  socket.on("disconnect", () => {
    console.log("Painel desconectado:", socket.id);
  });
});

// Atualiza os microfones dinâmicos para o PRÓXIMO momento
app.post("/microfones", (req, res) => {
  const { mics } = req.body;
  if (!Array.isArray(mics)) {
    return res.status(400).json({ error: "Formato inválido" });
  }

  microfonesProximo = mics;
  broadcastUpdate();

  res.json({ message: "Microfones atualizados", total: mics.length });
});

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
  microfonesAtual = [];
  microfonesProximo = [];

  broadcastUpdate(); // Avisa todo mundo

  res.json({
    message: "Programa do culto atualizado",
    totalMomentos: culto.length
  });
});

// Mostra o momento atual do culto (Mantido por compatibilidade inicial, mas o WebSocket assume agora)
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
    microfonesAtual = [...microfonesProximo]; // Transfere os que estavam preparados para Atual
    microfonesProximo = []; // Limpa o Próximo 
    broadcastUpdate(); // Avisa todo mundo
  }

  res.json({ ok: true });
});

// Volta o momento
app.post("/voltar", (req, res) => {
  if (indexAtual > 0) {
    indexAtual--;
    microfonesProximo = [...microfonesAtual]; // Recua: Atual vira Próximo
    microfonesAtual = []; // Limpa o atual
    broadcastUpdate(); // Avisa todo mundo
  }

  res.json({ ok: true });
});
