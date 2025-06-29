import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Splash from './Splash';
import {
  adicionarOpcoes,
  limpar,
  salvarDadosNoFirebase as salvarDadosService,
} from './utils.js/index';
import './css/index.css';

function Create() {
  const [mostrarSplash, setMostrarSplash] = useState(true);
  const [mostrarConteudo, setMostrarConteudo] = useState(false); // controla exibição do conteúdo principal
  const navigate = useNavigate();

  function salvar() {
    salvarDadosService(() => {
      navigate('/success');
    });
  }

  function onSplashStartFadeOut() {
    setMostrarConteudo(true);
  }

  function onSplashEnd() {
    setMostrarSplash(false);
  }

  return (
    <>
      {mostrarConteudo && (
        <div className="body" style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
          <div className="container">
            <div id="tab1" className="pageactive">
              <h1>Crie uma enquete</h1>
              <p>Preencha os campos abaixo para criar sua enquete.</p>
            </div>

            <fieldset className="tituloFieldset">
              <legend id="titulo">Título:</legend>
              <div className="opcoes">
                <input
                  autocomplete="off"

                  className="tituloEnquete"
                  type="text"
                  id="inputTitulo"
                  placeholder="Digite um título"
                  // Aqui talvez queira controlar via estado
                />
              </div>
            </fieldset>

            <fieldset className="opcoesFieldset">
              <legend> Adicione opções:</legend>
              <ul className="fundoEnquetes" id="listaDeEnquetes">
                <li>
                  <div id="opcoes01" className="opcoes">
                    <input className="input01" type="text" id="input01" placeholder="Opção 01" />
                    <button onClick={adicionarOpcoes} className="deletar">+</button>
                  </div>
                </li>
              </ul>
            </fieldset>

            <div className="adicionarOpcoes">
              <button className="buttonAdicionar" onClick={adicionarOpcoes}>Adicionar opções</button>
              <button onClick={limpar} className="buttonLimpar">Limpar</button>
            </div>

            <div className="buttonSalvar">
              <button onClick={salvar} className="buttonSalvarbtn">Salvar Enquete</button>
            </div>

            <h3 id="linkCompartilhar" style={{ display: 'none' }}>
              Carregando...
            </h3>
          </div>
        </div>
      )}

      {mostrarSplash && (
        <Splash
          onStartFadeOut={onSplashStartFadeOut}
          onFinish={onSplashEnd} // vai ser chamado ao final da animação
        />
      )}
    </>
  );
}

export default Create;
