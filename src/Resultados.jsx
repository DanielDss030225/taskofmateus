import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  mostrarSpinnerComAlerta,
  esconderSpinnerComAlerta,
  carregarEnqueteFirebase,
  obterRotuloPorQueryParam,
} from "./utils.js/resultados.js";
import './css/Resultados.css';

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a855f7", "#f43f5e"];

// Tooltip customizada para ambos os gráficos
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const entry = payload[0];

    return (
      <div
        style={{
          backgroundColor: "#222",
          color: "#fff",
          borderRadius: "8px",
          padding: "10px 14px",
          boxShadow: "0 0 8px rgba(0,0,0,0.3)",
          fontSize: "0.85rem",
        }}
      >
        <div><strong>{entry.name || entry.payload.nome}</strong></div>
        <div>{entry.value} voto(s)</div>
      </div>
    );
  }

  return null;
};

function Resultados() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [dados, setDados] = useState([]);

  useEffect(() => {
    mostrarSpinnerComAlerta();

    const rotulo = obterRotuloPorQueryParam();

    if (rotulo) {
      carregarEnqueteFirebase(rotulo)
        .then((resultado) => {
          setDados(resultado);
        })
        .catch((err) => {
          alert("Erro ao carregar enquete: " + err.message);
        })
        .finally(() => {
          esconderSpinnerComAlerta();
          setCarregando(false);
        });
    } else {
      alert("Código da enquete não encontrado na URL.");
      esconderSpinnerComAlerta();
      setCarregando(false);
    }
  }, []);

  function voltar() {
    navigate(-1);
  }

  return (
    <div className="resultados-container">
      {!carregando && <h1>Resultados da Enquete</h1>}

      {carregando ? (
        <div className="spinner-wrapper">
          <div className="spinner"></div>
        </div>
      ) : dados.length === 0 ? (
        <p className="no-data-message">Nenhum resultado disponível.</p>
      ) : (
        <>
          <div className="chart-row">
            <section className="chart-wrapper bar-chart">
              <h2>Gráfico de Barras</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dados} margin={{ top: 20, right: 30, bottom: 5, left: 20 }}>
                  <XAxis dataKey="nome" stroke="#4CAF50" />
                  <YAxis stroke="#4CAF50" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="votos" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="chart-wrapper pizza-chart">
              <h2>Gráfico de Pizza</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={dados}
                    dataKey="votos"
                    nameKey="nome"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#4CAF50"
                    label={(entry) => entry.nome}
                  >
                    {dados.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </section>
          </div>

          <button className="btn-voltar" onClick={voltar}>
            Voltar à enquete
          </button>
        </>
      )}
    </div>
  );
}

export default Resultados;
