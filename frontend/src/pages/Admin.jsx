import { useEffect, useState } from "react";
import "../styles/style-admin.css";
import TransitionText from "../components/TransitionText";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [atual, setAtual] = useState("Carregando...");
  const [proximo, setProximo] = useState("...");
  const [terceiro, setTerceiro] = useState("...");
  const [programa, setPrograma] = useState("");
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState("");
  
  const navigate = useNavigate();

  // Relógio
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔄 carregar estado do culto
  function carregar() {
    fetch("http://localhost:3000/hub")
      .then(res => res.json())
      .then(data => {
        setAtual(data.atual || "Não iniciado / Fim");
        setProximo(data.proximo || "");
        setTerceiro(data.proximos || "");
      })
      .catch(() => {
        setAtual("⚠️ Servidor Desconectado");
      });
  }

  // ⏭️ avançar momento
  function avancar() {
    if (loading) return;
    setLoading(true);

    fetch("http://localhost:3000/avancar", { method: "POST" })
      .then(() => carregar())
      .catch(() => alert("⚠️ Erro ao avançar momento"))
      .finally(() => setLoading(false));
  }

  // ⏮️ voltar momento
  function voltar() {
    if (loading) return;
    setLoading(true);

    fetch("http://localhost:3000/voltar", { method: "POST" })
      .then(() => carregar())
      .catch(() => alert("⚠️ Erro ao voltar momento"))
      .finally(() => setLoading(false));
  }

  // 💾 salvar programa do culto
  function salvarCulto() {
    const momentos = programa
      .split("\n")
      .map(l => l.trim())
      .filter(l => l !== "");

    fetch("http://localhost:3000/culto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ momentos })
    })
      .then(res => res.json())
      .then(() => {
        alert("Programa do culto salvo com sucesso!");
        carregar();
        document.getElementById("admin-menu-toggle").checked = false; // Fecha o menu
      })
      .catch(() => {
        alert("Erro ao salvar o culto");
      });
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div id="admin-container">
      {/* Logo IASD */}
      <div className="logo-iasd-admin" onClick={() => navigate("/")}>
        <img src="/assets/logo-iasd-blue.png" alt="Logo IASD" />
      </div>

      {/* Central Card */}
      <div id="admin-card">
        <div className="admin-card-content">
          <span className="label">Atualmente</span>
          <TransitionText as="h1" id="admin-atual" text={atual} />

          <span className="label-sub">Próximo será</span>
          <TransitionText as="h2" id="admin-proximo" text={proximo} />

          <span className="label-sub">Próximo então</span>
          <TransitionText as="h2" id="admin-terceiro" text={terceiro} />
        </div>
      </div>

      {/* Controles: Voltar */}
      <div className="control-left" onClick={voltar}>
        <ion-icon name="arrow-back-outline"></ion-icon>
      </div>

      {/* Controles: Centro (Relógio e Menu) */}
      <div className="control-center">
        <div className="clock">{time}</div>
        
        <input type="checkbox" id="admin-menu-toggle" />
        <label htmlFor="admin-menu-toggle" id="admin-menu-btn">
          <ion-icon name="menu-outline"></ion-icon>
        </label>

        <label htmlFor="admin-menu-toggle" id="admin-overlay"></label>

        <div id="admin-menu-panel">
          <h3>Configurar Programa</h3>
          <textarea
            rows="8"
            placeholder="Um momento por linha"
            value={programa}
            onChange={(e) => setPrograma(e.target.value)}
          />
          <button onClick={salvarCulto}>Salvar programa</button>
        </div>
      </div>

      {/* Controles: Avançar */}
      <div className="control-right" onClick={avancar}>
        <ion-icon name="arrow-forward-outline"></ion-icon>
      </div>
    </div>
  );
}
