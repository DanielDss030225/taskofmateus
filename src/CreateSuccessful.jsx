import { useEffect } from 'react';
import './css/index.css';
import {
  compartilharLink
  
} from './utils.js/index'; // ajuste o caminho
import { useNavigate } from 'react-router-dom';

function CreateSuccessful() {
  const navigate = useNavigate();


  function back() {
   
      // Navega para a página de sucesso após salvar
      navigate('/');
   
  }


  useEffect(() => {
    const linkSalvo = localStorage.getItem('linkEnquete');
    if (linkSalvo) {
      const elem = document.getElementById('linkCompartilhar');
      if (elem) {
        elem.textContent = linkSalvo;
      }
    }
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <div className="container">

        <div id="tab2" className="page2">
          <h1>Enquete adicionada com sucesso!</h1>
          <p className="labelLike">Agora compartilhe este link com os seus amigos!</p>

          <fieldset className="opcoesFieldset">
            <legend>Link da sua enquete:</legend>
            <ul className="fundoEnquetes" id="listaDeEnquetes">
              <a className="paraLi" onClick={compartilharLink}>
                <li>
                  <h3 id="linkCompartilhar">Carregando...</h3>
                </li>
              </a>
            </ul>
          </fieldset>

          <div className="adicionarOpcoes">
            <button className="buttonAdicionar1" onClick={back}>
              Clique para adicionar outra enquete!
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CreateSuccessful;
