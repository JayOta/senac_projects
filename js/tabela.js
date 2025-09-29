// js/tabela.js

document.addEventListener("DOMContentLoaded", () => {
  // 1. Pega o parâmetro 'serie' da URL (Ex: tabela.html?serie=1)
  const urlParams = new URLSearchParams(window.location.search);
  const serie = urlParams.get("serie");

  // Elementos DOM
  const serieTitulo = document.getElementById("serie-titulo");
  const tabelaCorpo = document.getElementById("tabela-corpo");
  const loadingMessage = document.getElementById("loading-message");
  const tabelaElement = document.querySelector(".tabela-projetos");
  const erroMessage = document.getElementById("erro-message");

  // Validação inicial da série
  if (!serie || !["1", "2", "3"].includes(serie)) {
    serieTitulo.textContent = "Erro na Seleção";
    loadingMessage.textContent =
      "Série inválida. Retorne à página de cadastro.";
    return;
  }

  // Atualiza o título da página
  serieTitulo.textContent = serie;

  // URL da nossa API PHP
  const API_URL = `listar.php?serie=${serie}`;

  // Função auxiliar para criar o link (se houver URL) ou mostrar um traço
  const criarLink = (url) =>
    url ? `<a href="${url}" target="_blank">Ver Link</a>` : "-";

  async function carregarProjetos() {
    loadingMessage.classList.remove("hidden"); // Mostra "Carregando..."
    tabelaElement.classList.add("hidden"); // Esconde a tabela

    try {
      const response = await fetch(API_URL);
      const projetos = await response.json(); // Tenta ler como JSON

      loadingMessage.classList.add("hidden"); // Esconde "Carregando..."
      tabelaElement.classList.remove("hidden"); // Mostra a tabela

      if (!response.ok) {
        // Erro retornado pelo PHP (ex: Falha na conexão com o BD)
        // Colspan ajustado para 6
        tabelaCorpo.innerHTML = `<tr class="no-data"><td colspan="6">${
          projetos.message || "Erro ao carregar os dados."
        }</td></tr>`;
        erroMessage.textContent = `Erro: ${
          projetos.message || "Falha na comunicação com o servidor."
        }`;
        erroMessage.classList.remove("hidden");
        return;
      }

      if (projetos.length === 0) {
        // Colspan ajustado para 6
        tabelaCorpo.innerHTML = `<tr class="no-data"><td colspan="6">Nenhum projeto cadastrado para o ${serie}º Ano.</td></tr>`;
      } else {
        // Monta a tabela
        projetos.forEach((projeto) => {
          const tr = document.createElement("tr");

          tr.innerHTML = `
            <td>${projeto.nome_aluno}</td>
                        <td>${criarLink(projeto.link_github)}</td>
                        <td>${criarLink(projeto.link_github_atv2)}</td>
                        <td>${criarLink(projeto.link_github_atv3)}</td>
                        <td>${criarLink(projeto.link_github_atv4)}</td>
                        <td>${criarLink(projeto.link_github_atv5)}</td>
          `;
          tabelaCorpo.appendChild(tr);
        });
      }
    } catch (error) {
      loadingMessage.classList.add("hidden");
      tabelaElement.classList.add("hidden");
      erroMessage.textContent =
        "Falha na conexão. Verifique se o servidor está disponível.";
      erroMessage.classList.remove("hidden");
      console.error("Erro de Fetch:", error);
    }
  }

  carregarProjetos();
});
