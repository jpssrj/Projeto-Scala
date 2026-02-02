import { useEffect, useState } from "react";
import "../styles/style-admin.css";

export default function Admin() {
  const [momentoAtual, setMomentoAtual] = useState("Carregando...");
  const [programa, setPrograma] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔄 carregar estado do culto
  function carregar() {
    fetch("http://localhost:3000/hub")
      .then(res => {
        if (!res.ok) {
          throw new Error("Erro ao buscar estado");
        }
        return res.json();
      })
      .then(data => {
        setMomentoAtual("Agora: " + data.atual);
      })
      .catch(() => {
        setMomentoAtual("⚠️ Servidor Desconectado");
      });
  }

  // ⏭️ avançar momento
  function avancar() {
    setLoading(true);

    fetch("http://localhost:3000/avancar", {
      method: "POST"
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Erro ao avançar");
        }
      })
      .then(() => carregar())
      .catch(() => {
        alert("⚠️ Erro ao avançar momento");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // 💾 salvar programa do culto
  function salvarCulto() {
    const momentos = programa
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

  // 🔥 equivalente ao carregar() do JS original
  useEffect(() => {
    carregar();
  }, []);

  return (
    <div className="container">
      <div className="box-control">
        <h1>Controle do Culto</h1>

        <p id="momento-atual">{momentoAtual}</p>

        <button 
          id="btn-avancar" 
          onClick={avancar} 
          disabled={loading}
        >
          {loading ? "Avançando..." : "Avançar momento"}
        </button>

        <br />

        <h3>Programa do Culto</h3>

        <textarea
          id="programa"
          rows="8"
          placeholder="Um momento por linha"
          value={programa}
          onChange={(e) => setPrograma(e.target.value)}
        />

        <button onClick={salvarCulto}>
          Salvar programa
        </button>
      </div>
    </div>
  );
}
