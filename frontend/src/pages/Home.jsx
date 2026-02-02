import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [atual, setAtual] = useState("...");
  const [proximo, setProximo] = useState("...");
  const [terceiro, setTerceiro] = useState("...");
  const [online, setOnline] = useState(false);
  const navigate = useNavigate();

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
            <h1 id="atual-nome">{atual}</h1>

            <span id="proximo">Próximo será:</span>
            <h2 id="proximo-nome">{proximo}</h2>

            <span id="terceiro">Próximo então:</span>
            <h2 id="terceiro-nome">{terceiro}</h2>
          </div>
        </div>

        {/* Radial Menu */}
        <input type="checkbox" id="hub-toggle" />

        <label htmlFor="hub-toggle" id="hub-btn">
          <ion-icon name="menu-outline"></ion-icon>
        </label>

        {/* Overlay */}
        <label htmlFor="hub-toggle" id="hub-overlay"></label>

        {/* Menu */}
        <div id="hub-menu">
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
