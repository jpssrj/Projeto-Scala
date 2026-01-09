const express = require("express"); //Importa o express

const app = express(); //Cria o servidor
const PORT = 3000; //Porta

app.use((req, res, next) => { //Autorização do front acessar o back e sem os erros de policy -.-  
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});


app.use(express.json()); //Necessário para ler os json enviados

let hubData = { //Variável global do servidor para guardar e alterar dados
  atual: "...",
  proximo: "...",
  proximos: "..."
};

app.get("/hub", (req, res) => { //Responde com os dados que estão na let hubData
  res.json(hubData);
});

app.post("/hub", (req, res) => { //Mostrará o que a rota /hub tem a mostrar
  const { atual, proximo, proximos } = req.body;

  hubData.atual = atual; //Atualização de memória através do post
  hubData.proximo = proximo;
  hubData.proximos = proximos;

  res.json({ //Notifica se a atualização de memória foi concluida com sucesso
    message: "Hub atualizado com sucesso",
    hubData
  });
});

app.listen(PORT, () => { //Liga o servidor e notifica em qual porta está hospedado
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
