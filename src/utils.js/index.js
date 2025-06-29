import { database, ref, set } from '../firebase/firebase-config.js';

let idsDosInputs = ['input01'];
let contadorInput = 2;

function atualizarPlaceholders() {
  try {
    const inputs = document.querySelectorAll('#listaDeEnquetes input');
    inputs.forEach((input, index) => {
      if (input.id !== 'input01') {
        const numero = (index + 1).toString().padStart(2, '0');
        input.placeholder = `Opção ${numero}`;
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar placeholders:', error);
  }
}

function adicionarOpcoes() {
  try {
    const lista = document.getElementById('listaDeEnquetes');
    if (!lista) throw new Error('Elemento #listaDeEnquetes não encontrado.');

    if (lista.children.length >= 30) {
      alert('Máximo de 30 opções atingido.');
      return;
    }

    const li = document.createElement('li');
    const input = document.createElement('input');
    const btnRemover = document.createElement('button');

    input.type = 'text';
    input.placeholder = `Opção ${lista.children.length + 1}`;

    btnRemover.textContent = 'X';

    const idInput = `input-opcao-${contadorInput}`;
    li.id = `li-opcao-${contadorInput}`;
    input.id = idInput;
    contadorInput++;

    idsDosInputs.push(idInput);

    li.appendChild(input);
    li.appendChild(btnRemover);
    lista.appendChild(li);

    btnRemover.addEventListener('click', () => {
      const index = idsDosInputs.indexOf(input.id);
      if (index > -1) idsDosInputs.splice(index, 1);
      lista.removeChild(li);
      atualizarPlaceholders();
    });

    atualizarPlaceholders();
  } catch (error) {
    console.error('Erro ao adicionar opções:', error);
  }
}

function limpar() {
  try {
    const lista = document.getElementById('listaDeEnquetes');
    if (!lista) throw new Error('Elemento #listaDeEnquetes não encontrado.');

    const primeiroLi = document.getElementById('input01')?.closest('li');
    lista.innerHTML = '';

    if (primeiroLi) {
      const input01 = primeiroLi.querySelector('input');
      if (input01) input01.value = '';
      lista.appendChild(primeiroLi);
    } else {
      const li = document.createElement('li');
      const input = document.createElement('input');
      input.type = 'text';
      input.id = 'input01';
      input.placeholder = 'Opção 01';
      li.appendChild(input);
      lista.appendChild(li);
    }

    idsDosInputs = ['input01'];
    contadorInput = 2;
  } catch (error) {
    console.error('Erro ao limpar opções:', error);
  }
}

function gerarCodigoUnico() {
  return 'xxxx-xxxx-xxxx'.replace(/[x]/g, () => (Math.random() * 16 | 0).toString(16));
}

function salvarDadosNoFirebase(onSuccess) {
  try {
    const codigoUnico = gerarCodigoUnico();
    const userId = codigoUnico;
    const dadosParaSalvar = {};

    const inputTitulo = document.getElementById('inputTitulo');
    if (!inputTitulo) throw new Error('Campo de título não encontrado.');

    let titulo = inputTitulo.value.trim();
    dadosParaSalvar['Titulo'] = titulo || 'Título indefinido.';
    dadosParaSalvar['codigoConvite'] = codigoUnico;

    let todosPreenchidos = true;

    const todosIds = [...new Set(idsDosInputs)];
    if (!todosIds.includes('input01')) todosIds.unshift('input01');
    else {
      todosIds.splice(todosIds.indexOf('input01'), 1);
      todosIds.unshift('input01');
    }

    todosIds.forEach((id, index) => {
      const input = document.getElementById(id);
      if (input) {
        const valor = input.value.trim();
        if (valor !== '') {
          const chave = `Opcao${(index + 1).toString().padStart(2, '0')}`;
          dadosParaSalvar[chave] = [valor, 0];
        } else {
          todosPreenchidos = false;
        }
      }
    });

    if (!todosPreenchidos) {
      alert('Preencha todos os campos antes de salvar.');
      return;
    }

    const referencia = ref(database, `enquetes/${userId}`);
    set(referencia, dadosParaSalvar)
      .then(() => {
        const isLocalhost =
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1';

        const BASE_URL = isLocalhost
          ? 'http://localhost:5173/YourTask?ref='
          : 'https://danieldss030225.github.io/taskmateus/YourTask?ref=';

        const link = BASE_URL + codigoUnico;
        const elem = document.getElementById('linkCompartilhar');
        if (elem) elem.textContent = link;

        localStorage.setItem('linkEnquete', link);

        limpar();

        if (typeof onSuccess === 'function') onSuccess(link);
      })
      .catch((error) => {
        console.error('Erro ao salvar no Firebase:', error);
      });
  } catch (error) {
    console.error('Erro ao executar salvarDadosNoFirebase:', error);
  }
}

function deletarLinkLocalStorage() {
  try {
    localStorage.removeItem('linkEnquete');
    console.log('Link removido do localStorage.');
  } catch (error) {
    console.error('Erro ao remover link do localStorage:', error);
  }
}

function compartilharLink() {
  try {
    const elem = document.getElementById('linkCompartilhar');
    const url = elem ? elem.textContent : null;
    if (url) {
      window.open(url, '_blank');
    } else {
      console.warn('Nenhum link encontrado no elemento #linkCompartilhar.');
    }
  } catch (error) {
    console.error('Erro ao compartilhar link:', error);
  }
}


export {
  adicionarOpcoes,
  limpar,
  salvarDadosNoFirebase,
  deletarLinkLocalStorage,
  compartilharLink
  
};
