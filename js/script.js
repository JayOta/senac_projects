// js/script.js

document.addEventListener("DOMContentLoaded", () => {
  const formProjeto = document.getElementById("form-projeto");
  const mensagemStatus = document.getElementById("mensagem-status");
  const API_URL = "cadastrar.php"; // Aponta para o arquivo PHP na raiz

  if (formProjeto) {
    formProjeto.addEventListener("submit", async (event) => {
      event.preventDefault(); // Coleta os dados do formulário

      const nomeAluno = document.getElementById("nome_aluno").value;
      const anoSerie = document.getElementById("ano_serie").value;

      // COLETANDO OS 5 LINKS
      const linkGithub = document.getElementById("link_github").value; // Atividade 1
      const linkAtv2 = document.getElementById("link_atv2").value;
      const linkAtv3 = document.getElementById("link_atv3").value;
      const linkAtv4 = document.getElementById("link_atv4").value;
      const linkAtv5 = document.getElementById("link_atv5").value;

      const dadosProjeto = {
        nome_aluno: nomeAluno,
        ano_serie: anoSerie,
        link_github: linkGithub, // Atividade 1
        link_github_atv2: linkAtv2,
        link_github_atv3: linkAtv3,
        link_github_atv4: linkAtv4,
        link_github_atv5: linkAtv5,
      };

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosProjeto),
        });

        const resultado = await response.json();

        if (response.ok) {
          mostrarStatus("Projeto cadastrado com sucesso!", "sucesso"); // Redirecionamento após o sucesso

          setTimeout(() => {
            window.location.href = `tabela.html?serie=${dadosProjeto.ano_serie}`;
          }, 1500);
        } else {
          mostrarStatus(
            `Erro ao cadastrar: ${resultado.message || "Erro desconhecido"}`,
            "erro"
          );
        }
      } catch (error) {
        mostrarStatus(
          "Falha na conexão. Verifique se o servidor está disponível."
        );
        console.error("Erro de conexão:", error);
      }
    });
  } // Função auxiliar para mostrar o status (continua a mesma)

  function mostrarStatus(mensagem, tipo) {
    mensagemStatus.textContent = mensagem;
    mensagemStatus.className = "";
    mensagemStatus.classList.add(
      tipo === "sucesso" ? "status-sucesso" : "status-erro"
    );
    mensagemStatus.classList.remove("hidden");
  }
});
