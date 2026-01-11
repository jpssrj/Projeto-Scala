function autoAtt () {
  fetch("http://localhost:3000/hub") //Puxa a rota /hub e pede os dados, com o protocólo http
    .then(response => response.json()) //A resposta recebida será traduzida para o navegador
    .then(data => { //Data é o let hubData que tinha no script.js lá do scala-backend, irá fazer a troca dos ids pelos post
      console.log("Buscando dados da rota /hub...");
      document.getElementById("atual-nome").innerText = data.atual;
      document.getElementById("proximo-nome").innerText = data.proximo;
      document.getElementById("terceiro-nome").innerText = data.proximos;
    })
    .catch(error => { //Apenas um aviso caso dê algum erro ao puxar os dados
      console.error("Erro ao buscar dados:", error);
    });
  }

  autoAtt(); //Chama toda vez que abre a página, depois muda para a automática durante a página em estado aberto
  setInterval(autoAtt, 3000); //Puxa uma atualização automática a cada 3.000 milésimos (3 segundo)