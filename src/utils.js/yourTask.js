import { database, ref, set, get, child, update } from '../firebase/firebase-config.js';

const isLocalhost =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const BASE_URL = isLocalhost
  ? 'http://localhost/TAREFA%20DO%20MATEUS/yourTask.html'
  : 'https://danieldss030225.github.io/taskmateus/yourTask.html';

const API_URL = BASE_URL + '/api';

console.log('API rodando em:', API_URL);

// 🔄 LocalStorage
function obterRotuloLocalStorage() {
  const codigoSalvo = localStorage.getItem('codigo');
  return `enquetes/${codigoSalvo}`;
}

// ✅ Pega o código da enquete via URL ?ref=xxx
function obterRotuloPorQueryParam() {
  const params = new URLSearchParams(window.location.search);
  const codigo = params.get('ref');
  return codigo ? `enquetes/${codigo}` : null;
}

function mostrarSpinnerComAlerta() {
  const el = document.getElementById('spinnerAlerta');
  if (el) el.style.display = 'flex';
}

function esconderSpinnerComAlerta() {
  const el = document.getElementById('spinnerAlerta');
  if (el) el.style.display = 'none';
}

// ✅ Evita múltiplas criações de elementos duplicados
async function carregarEnqueteFirebase(rotulo, executarAcao) {
  const dbRef = ref(database);
  const snapshot = await get(child(dbRef, rotulo));
  if (snapshot.exists()) {
    const lista = snapshot.val();

    const listaDeEnquetes = document.getElementById("listaDeEnquetes");
    if (listaDeEnquetes) {
      listaDeEnquetes.innerHTML = '';
    }

    const chavesCriadas = new Set();

    for (const [chave, valor] of Object.entries(lista)) {
      if (!chavesCriadas.has(chave)) {
        chavesCriadas.add(chave);
        await new Promise((resolve) => {
          executarAcao(chave, valor);
          setTimeout(resolve, 0);
        });
      }
    }
  }

  esconderSpinnerComAlerta();
}

let ultimoSelecionado = null;

function executarAcao(chave, valor, name = "grupo-enquete") {
  if (!document || !window) return;

  if (chave === "Titulo") {
    const tituloElement = document.getElementById("textoDaTarefa");
    if (tituloElement) tituloElement.textContent = valor;
  } else if (chave === "codigoConvite") {
    const conviteElement = document.getElementById("codigo");
    if (conviteElement) conviteElement.textContent = valor;
  } else if (Array.isArray(valor)) {
    const listaDeEnquetes = document.getElementById("listaDeEnquetes");
    if (!listaDeEnquetes) return;

    const existe = document.getElementById(chave);
    if (existe) return; // Já existe este input, evita duplicação

    const fundo = document.createElement("li");
    const inputRadio = document.createElement("input");
    const texto = document.createElement("h3");
    const texto02 = document.createElement("h3");

    const textoId = `${chave}_texto`;
    const texto02Id = `${chave}_votos`;

    texto.textContent = valor[0];
    texto02.textContent = valor[1];

    texto.id = textoId;
    texto02.id = texto02Id;

    inputRadio.id = chave;
    inputRadio.type = 'radio';
    inputRadio.name = name;
    inputRadio.value = valor[0];
    inputRadio.classList.add('radio-estilizado');
    texto.classList.add("textoDinamic");

    fundo.appendChild(texto);
    fundo.appendChild(texto02);
    fundo.appendChild(inputRadio);
    listaDeEnquetes.appendChild(fundo);

    fundo.addEventListener('click', () => {
      inputRadio.checked = true;
      inputRadio.dispatchEvent(new Event('change'));
    });

    inputRadio.addEventListener('change', function () {
      if (ultimoSelecionado === this) return;

      const destino = document.getElementById("opcaoEscolhida");
      if (this.checked && destino) destino.textContent = valor[0];

      if (ultimoSelecionado) {
        const votosAnterior = document.getElementById(`${ultimoSelecionado.id}_votos`);
        if (votosAnterior) {
          let valorAntigo = parseInt(votosAnterior.textContent, 10) || 0;
          votosAnterior.textContent = Math.max(valorAntigo - 1, 0);
        }
      }

      const votosAtual = document.getElementById(texto02Id);
      if (votosAtual) {
        let votos = parseInt(votosAtual.textContent, 10) || 0;
        votosAtual.textContent = votos + 1;
      }

      ultimoSelecionado = this;
    });
  }
}

async function obterIP() {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  return data.ip;
}

function formatarIP(ip) {
  return ip.replace(/\./g, '-');
}

async function verificarERegistrarVoto(rotulo) {
  const ip = await obterIP();
  const ipFormatado = formatarIP(ip);
  const ipRef = ref(database, `${rotulo}/votos/${ipFormatado}`);

  const snapshot = await get(ipRef);
  if (snapshot.exists()) {
    alert("Você já está participando desta enquete.");
    return false;
  } else {
    await set(ipRef, true);
    alert("Obrigado por votar!");
    const codigo = rotulo.split('/').pop();
    window.location.href = `/Resultados?ref=${encodeURIComponent(codigo)}`;
    return true;
  }
}

async function salvarVotos(rotulo) {
  const listaDeEnquetes = document.getElementById("listaDeEnquetes");
  const filhos = listaDeEnquetes.querySelectorAll("li");

  let dadosAtualizados = {};

  filhos.forEach((li) => {
    const input = li.querySelector("input[type='radio']");
    const texto = li.querySelector("h3");
    const votos = li.querySelectorAll("h3")[1];

    if (input && texto && votos && input.checked) {
      const chave = input.id;
      const valorTexto = texto.textContent.trim();
      const valorVotos = parseInt(votos.textContent.trim(), 10) || 0;
      dadosAtualizados[chave] = [valorTexto, valorVotos];
    }
  });

  if (Object.keys(dadosAtualizados).length === 0) {
    alert("Por favor, selecione uma opção antes de votar.");
    return;
  }

  const ipPodeVotar = await verificarERegistrarVoto(rotulo);
  if (!ipPodeVotar) return;

  try {
    await update(ref(database, rotulo), dadosAtualizados);
    console.log("Votos salvos com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar votos:", error);
    alert("Erro ao salvar votos. Verifique o console.");
  }
}

export {
  BASE_URL,
  API_URL,
  mostrarSpinnerComAlerta,
  esconderSpinnerComAlerta,
  obterRotuloLocalStorage,
  obterRotuloPorQueryParam,
  carregarEnqueteFirebase,
  executarAcao,
  salvarVotos
};
