import { database, ref, get, child } from '../firebase/firebase-config.js';

// Função para obter o parâmetro "ref" da URL
export function obterRotuloPorQueryParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get('ref');
}

// Função para carregar enquete do Firebase, formatando dados conforme o formato:
// Opcao01: [nome, votos], Titulo, codigoConvite, etc
export async function carregarEnqueteFirebase(rotulo) {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `enquetes/${rotulo}`));

    if (!snapshot.exists()) {
      return [];
    }

    const dados = snapshot.val();

    // Filtra entradas que são arrays [nome, votos]
    const opcoes = Object.entries(dados)
      .filter(([key, value]) => Array.isArray(value) && value.length === 2)

   .map(([key, value]) => ({
        nome: value[0],
        votos: value[1],
        
      }));

    return opcoes;
  } catch (error) {
    console.error('Erro ao buscar dados no Firebase:', error);
    throw error;
  }
}

// Função para mostrar spinner
export function mostrarSpinnerComAlerta() {
  const spinner = document.getElementById("spinnerAlerta");
  if (spinner) spinner.style.display = "block";
}

// Função para esconder spinner
export function esconderSpinnerComAlerta() {
  const spinner = document.getElementById("spinnerAlerta");
  if (spinner) spinner.style.display = "none";
}
