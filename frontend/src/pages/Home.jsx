import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransitionText from "../components/TransitionText";

export default function Home() {
  const [atual, setAtual] = useState("...");
  const [proximo, setProximo] = useState("...");
  const [terceiro, setTerceiro] = useState("...");
  const [online, setOnline] = useState(false);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  function autoAtt() {
    fetch("http://localhost:3000/hub")
      .then(response => response.json())
      .then(data => {
        console.log("Buscando dados da rota /hub...");
        setOnline(true);
        setAtual(data.atual);
        setProximo(data.proximo);
        setTerceiro(data.proximos);
      })
      .catch(error => {
        console.error("Erro ao buscar dados:", error);
        setOnline(false);
      });
  }

  useEffect(() => {
    autoAtt(); // roda quando abre a página
    const interval = setInterval(autoAtt, 3000); // atualiza a cada 3s
    document.title = "Hub - IASD";
    return () => clearInterval(interval); // limpa o intervalo ao sair da página
  }, []);

  return (
    <>
      <div id="container">
        <div id="container-children">
          <div id="content-container-children">
            <span id="atual">Atualmente:</span>
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
