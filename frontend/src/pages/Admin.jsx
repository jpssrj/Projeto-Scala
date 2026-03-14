import { useEffect, useState } from "react";
import "../styles/style-admin.css";
import TransitionText from "../components/TransitionText";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export default function Admin() {
  const [atual, setAtual] = useState("Carregando...");
  const [proximo, setProximo] = useState("...");
  const [terceiro, setTerceiro] = useState("...");
  const [micsAtual, setMicsAtual] = useState([]); // state for what is currently showing
  const [programa, setPrograma] = useState("");
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("programa"); // "programa" ou "microfones"
  const [micsCount, setMicsCount] = useState(4); // default 4 mic forms
  const [micsArray, setMicsArray] = useState(["", "", "", ""]);
  
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

  // WebSockets para sincronizar estado
  useEffect(() => {
    const socket = io(`http://${window.location.hostname}:3000`);//permite que eu consiga acessar de outro dispositivo

    socket.on("connect", () => {
      console.log("Admin conectado ao Servidor");
    });

    socket.on("disconnect", () => {
      setAtual("⚠️ Servidor Desconectado");
    });

    socket.on("update-hub", (data) => {
      setAtual(data.atual || "Não iniciado / Fim");
      setProximo(data.proximo || "");
      setTerceiro(data.proximos || "");
      if (data.microfonesProximo && data.microfonesProximo.length > 0) {
        setMicsArray(data.microfonesProximo);
        setMicsCount(data.microfonesProximo.length);
      } else {
        setMicsArray(["", "", "", ""]); // fallbacks pra UI limpa
        setMicsCount(4);
      }
      setMicsAtual(data.microfones || []);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ⏭️ avançar momento
  function avancar() {
    if (loading) return;
    setLoading(true);

    fetch(`http://${window.location.hostname}:3000/avancar`, { method: "POST" })
      .catch(() => alert("⚠️ Erro ao avançar momento"))
      .finally(() => setLoading(false));
  }

  // ⏮️ voltar momento
  function voltar() {
    if (loading) return;
    setLoading(true);

    fetch(`http://${window.location.hostname}:3000/voltar`, { method: "POST" })
      .catch(() => alert("⚠️ Erro ao voltar momento"))
      .finally(() => setLoading(false));
  }

  // 💾 salvar programa do culto
  function salvarCulto() {
    const momentos = programa
      .split("\n")
      .map(l => l.trim())
      .filter(l => l !== "");

    fetch(`http://${window.location.hostname}:3000/culto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ momentos })
    })
      .then(res => res.json())
      .then(() => {
        alert("Programa do culto salvo com sucesso!");
        setMenuOpen(false); // Fecha o menu via state
      })
      .catch(() => {
        alert("Erro ao salvar o culto");
      });
  }

  // 🎤 salvar configurações de microfones
  function salvarMicrofones() {
    fetch(`http://${window.location.hostname}:3000/microfones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mics: micsArray.slice(0, micsCount) })
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status} - ${text}`);
        }
        return res.json();
      })
      .then(() => {
        alert("Microfones atualizados com sucesso!");
        setMenuOpen(false); // Fecha o menu
      })
      .catch((error) => {
        console.error(error);
        alert(`Erro ao atualizar microfones. Detalhes no console: ${error.message}`);
      });
  }

  // Handle mudança de cor do microfone
  function handleMicColorChange(index, color) {
    const newArr = [...micsArray];
    newArr[index] = color;
    setMicsArray(newArr);
  }

  // Lógica para crescer ou encolher o array se mudar o count
  function handleMicsCountChange(e) {
    const count = parseInt(e.target.value);
    setMicsCount(count);
    
    // Ajusta o array pra ter o tamanho certo caso cresça
    if (count > micsArray.length) {
      const diff = count - micsArray.length;
      setMicsArray([...micsArray, ...Array(diff).fill("")]);
    }
  }

  return (
    <div id="admin-container">
      {/* Logo IASD */}
      <div className="logo-iasd-admin" onClick={() => navigate("/")}>
        <img src="/assets/logo-iasd-blue.png" alt="Logo IASD" />
      </div>

      {/* Central Card */}
      <div id="admin-card">
        <div className="admin-card-content">
          <div className="admin-label-group">
            <span className="label">Atualmente</span>
            <div className="admin-mics-preview">
              {micsAtual.filter(Boolean).map((color, idx) => (
                <div key={idx} className="mic-badge-small" style={{ backgroundColor: color }}>
                  <ion-icon name="radio-outline"></ion-icon>
                </div>
              ))}
            </div>
          </div>
          <TransitionText as="h1" id="admin-atual" text={atual} />

          <div className="admin-label-group">
            <span className="label-sub">Próximo será</span>
            <div className="admin-mics-preview">
              {micsArray.slice(0, micsCount).filter(Boolean).map((color, idx) => (
                <div key={idx} className="mic-badge-small" style={{ backgroundColor: color }}>
                  <ion-icon name="radio-outline"></ion-icon>
                </div>
              ))}
            </div>
          </div>
          <TransitionText as="h2" id="admin-proximo" text={proximo} />

          <span className="label-sub">Próximo então</span>
          <TransitionText as="h2" id="admin-terceiro" text={terceiro} />
        </div>
      </div>

      {/* Controles: Voltar */}
      <div className="control-left" onClick={voltar}>
        <ion-icon name="arrow-back-outline"></ion-icon>
      </div>

      {/* Overlay e Menu Panel no root level para preencher a tela */}
      {menuOpen && (
        <div id="admin-overlay" onClick={() => setMenuOpen(false)}></div>
      )}

      <div id="admin-menu-panel" className={menuOpen ? "open" : ""}>
        {activeTab === "programa" ? (
          <>
            <h3>Configurar Programa</h3>
            <textarea
              rows="8"
              placeholder="Um momento por linha"
              value={programa}
              onChange={(e) => setPrograma(e.target.value)}
            />
          </>
        ) : (
          <>
            <h3>Configurar Microfones</h3>
            <div className="mics-config-group">
              <label>Quantidade de microfones</label>
              <select value={micsCount} onChange={handleMicsCountChange}>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            
            <div className="mics-selection-list">
              <span className="mics-label">Microfones que serão utilizados:</span>
              
              {micsArray.slice(0, micsCount).map((micColor, index) => (
                <div key={index} className="mic-slot">
                  <span className="mic-slot-title">Microfone {index + 1}</span>
                  
                  <div className="brand-group">
                    <span className="brand-name">Kadosh's:</span>
                    <div className="color-row">
                      {["#FFD700", "#FF00FF", "#00FF00", "#0000FF", "#FF0000"].map(c => (
                        <div 
                          key={c}
                          className={`color-circle ${micColor === c ? 'selected' : ''}`} 
                          style={{background: c}} 
                          onClick={() => handleMicColorChange(index, c)}
                        ></div>
                      ))}
                    </div>
                  </div>

                  <div className="brand-group">
                    <span className="brand-name">Shure's e Lyco's:</span>
                    <div className="color-row">
                      {["#FFFF00", "#00CC00", "#B8860B", "#8A2BE2", "#00FFFF"].map(c => (
                        <div 
                          key={c}
                          className={`color-circle ${micColor === c ? 'selected' : ''}`} 
                          style={{background: c}} 
                          onClick={() => handleMicColorChange(index, c)}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="menu-tabs">
          <button 
            className={`tab-btn ${activeTab === "programa" ? "active" : ""}`}
            onClick={() => setActiveTab("programa")}
          >
            <ion-icon name="options-outline"></ion-icon>
          </button>
          <button 
            className={`tab-btn ${activeTab === "microfones" ? "active" : ""}`}
            onClick={() => setActiveTab("microfones")}
          >
            <ion-icon name="mic-outline"></ion-icon>
          </button>
        </div>

        <button 
          className="save-btn" 
          onClick={activeTab === "programa" ? salvarCulto : salvarMicrofones}
        >
          {activeTab === "programa" ? "Salvar programa" : "Salvar microfones"}
        </button>
      </div>

      {/* Controles: Centro (Relógio e Menu) */}
      <div className="control-center">
        <div className="clock">{time}</div>
        
        <button id="admin-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          <ion-icon name="menu-outline"></ion-icon>
        </button>
      </div>

      {/* Controles: Avançar */}
      <div className="control-right" onClick={avancar}>
        <ion-icon name="arrow-forward-outline"></ion-icon>
      </div>
    </div>
  );
}
