import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import TransitionText from "../components/TransitionText";

export default function Home() {
  const [atual, setAtual] = useState("...");
  const [proximo, setProximo] = useState("...");
  const [terceiro, setTerceiro] = useState("...");
  const [mics, setMics] = useState([]);
  const [online, setOnline] = useState(false);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "Hub - IASD";

    // Conecta ao servidor WebSocket usando o IP que acessou a página
    const socket = io(`http://${window.location.hostname}:3000`); //permite que eu consiga entrar e acessar de outro dispositivo

    socket.on("connect", () => {
      console.log("Conectado no servidor");
      setOnline(true);
    });

    socket.on("disconnect", () => {
      console.log("Desconectado do servidor");
      setOnline(false);
    });

    // Ouve as atualizações do painel em tempo real
    socket.on("update-hub", (data) => {
      setAtual(data.atual);
      setProximo(data.proximo);
      setTerceiro(data.proximos);
      if (data.microfones) {
        setMics(data.microfones);
      }
    });

    // Limpa a conexão ao destruir o componente
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <div id="container">
        <div id="container-children">
          <div id="content-container-children">
            <div className="atual-header">
              <span id="atual">Atualmente:</span>
              <div className="mics-display">
                {mics.map((color, idx) => (
                  <div key={idx} className="mic-badge" style={{ backgroundColor: color }}>
                    {color && <ion-icon name="radio-outline"></ion-icon>}
                  </div>
                ))}
              </div>
            </div>
            <TransitionText as="h1" id="atual-nome" text={atual} />

            <span id="proximo">Próximo será:</span>
            <TransitionText as="h2" id="proximo-nome" text={proximo} />

            <span id="terceiro">Próximo então:</span>
            <TransitionText as="h2" id="terceiro-nome" text={terceiro} />
          </div>
        </div>

        {/* Radial Menu Controlado por React */}
        <button id="hub-btn" onClick={() => setMenuOpen(!menuOpen)}>
          <ion-icon name="menu-outline"></ion-icon>
        </button>

        {/* Overlay */}
        {menuOpen && (
          <div id="hub-overlay" onClick={() => setMenuOpen(false)}></div>
        )}

        {/* Menu */}
        <div id="hub-menu" className={menuOpen ? "open" : ""}>
          <a href="#">Configurações</a>
          <a href="#">Conectar</a>
          <button onClick={() => navigate("/admin")}>Painel ADM</button>
        </div>

        {/* Logo IASD */}
        <div className="logo-iasd">
          <a href="https://adventistas.org" target="_blank">
            <img
              src="/assets/logo-iasd-blue.png"
              alt="Logo da Igreja Adventista do Sétimo Dia"
            />
          </a>
        </div>
      </div>

      <div id="server-status" className={online ? "online" : "offline"}>
        <span>● {online ? "Conectado" : "Desconectado"}</span>
      </div>
    </>
  );
}
