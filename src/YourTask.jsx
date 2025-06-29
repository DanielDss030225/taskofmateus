import React, { useEffect, useState } from 'react';
import './css/index.css';
import { useNavigate } from 'react-router-dom';

import {
  mostrarSpinnerComAlerta,
  esconderSpinnerComAlerta,
  carregarEnqueteFirebase,
  executarAcao,
  salvarVotos,
  obterRotuloPorQueryParam
} from './utils.js/yourTask.js';

function YourTask() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);

  function back() {
    navigate('/');
  }

  useEffect(() => {
    mostrarSpinnerComAlerta();

    const rotulo = obterRotuloPorQueryParam();

    if (rotulo) {
      // Aqui aguardamos a função carregarEnqueteFirebase que deve ser async
      carregarEnqueteFirebase(rotulo, executarAcao).then(() => {
        esconderSpinnerComAlerta();
        setCarregando(false);
      });
    } else {
      alert("Código da enquete não encontrado na URL.");
      esconderSpinnerComAlerta();
      setCarregando(false);
    }
  }, []); // executa uma única vez

function handleSalvarVoto() {
  const rotulo = obterRotuloPorQueryParam();
  if (rotulo) {
    salvarVotos(rotulo);
  } else {
    alert("Código da enquete não encontrado.");
  }
}

function irParaResultados() {
  const rotulo = obterRotuloPorQueryParam();
  if (rotulo) {
    const codigo = rotulo.split('/').pop();

    // Redireciona para /YourTask passando o código no parâmetro "ref"
    window.location.href = `/Resultados?ref=${encodeURIComponent(codigo)}`;
  } else {
    alert("Código da enquete não encontrado.");
  }
}

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <div className="container" style={{ position: 'relative' }}>
        <div id="tab2" className="page2">

        {/* Spinner centralizado */}
        {carregando && (
          <div
            id="spinnerAlerta"
            className="spinnerClass"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
          >
            <div className="spinner"></div>
          </div>
        )}

        {/* Conteúdo principal permanece sempre no DOM */}
        <div id="tab1" className="page active" style={{ display: carregando ? 'none' : 'block' }}>
          <h1 id="textoDaTarefa">Carregando...</h1>
          <p style={{ display: 'none' }} id="codigo"></p>
          <p style={{ display: 'none' }} id="opcaoEscolhida">OPÇÃO ESCOLHIDA</p>
          <p  className="labelLike">Participe desta enquete deixando o seu voto abaixo.</p>
        </div>

        <fieldset className="opcoesFieldset" style={{ display: carregando ? 'none' : 'block' }}>
          <legend>Vote:</legend>
          <ul className="fundoEnquetes" id="listaDeEnquetes"></ul>
        </fieldset>

        <div className="adicionarOpcoes" style={{ display: carregando ? 'none' : 'block' }}>
          <button className="buttonAdicionar" onClick={handleSalvarVoto}>
            Registrar meu voto!
          </button>
          <button onClick={irParaResultados}>Resultados</button>
        </div>

        <p
          className="labelLike"
          onClick={back}
          style={{ cursor: 'pointer', marginTop: '1rem', display: carregando ? 'none' : 'block' }}
        >
          Gostou desta enquete? Clique e crie uma igual!
        </p>
        </div>
      </div>
    </div>
  );
}

export default YourTask;
