import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addGoal, getAllGoals, deleteGoal, getAllSales } from '../indexedDB';
import '../App.css';

const MinhasMetas = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [metas, setMetas] = useState([]);
  const [novaMeta, setNovaMeta] = useState({ nome: '', objetivo: '', periodo: '' });

  const fetchMetas = async () => {
    const allMetas = await getAllGoals();
    const allSales = await getAllSales();

    const metasWithProgress = allMetas.map(meta => {
      const metaCreationDate = new Date(meta.dataCriacao);
      let totalSales = 0;

      // Calcular apenas com vendas após a data de criação da meta
      allSales.forEach(sale => {
        const saleDate = new Date(sale.date);
        if (saleDate >= metaCreationDate) {
          const sanduiches = parseFloat(sale.sanduiches || 0);
          const caldo = parseFloat(sale.caldo || 0);
          const cafe = parseFloat(sale.cafe || 0);
          totalSales += sanduiches * 5 + caldo * 5 + cafe * 2;
        }
      });

      const progresso = totalSales > 0 ? Math.min((totalSales / meta.objetivo) * 100, 100) : 0; // Garantir que o progresso inicial seja 0%
      console.log(`Meta ID: ${meta.id}, Progresso Calculado: ${progresso.toFixed(2)}%, Total de Vendas: ${totalSales}`);
      return { ...meta, progresso }; 
    });

    setMetas(metasWithProgress.reverse());
  };

  useEffect(() => {
    fetchMetas();
  }, []);

  const handleNovaMetaClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovaMeta({ ...novaMeta, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Captura a data e hora atual no fuso horário local
    const localDate = new Date();
    const timezoneOffset = localDate.getTimezoneOffset() * 60000; // Offset em milissegundos
    const localISOTime = new Date(localDate - timezoneOffset).toISOString().slice(0, -1);

    const newGoal = {
      ...novaMeta,
      vendasAssociadas: [],
      progresso: 0,
      dataCriacao: localISOTime, // Usando a data local formatada
    };

    try {
      await addGoal(newGoal);
      console.log(`Nova Meta Criada: ${JSON.stringify(newGoal)}`);
      await fetchMetas();
      setNovaMeta({ nome: '', objetivo: '', periodo: '' });
      setShowPopup(false);
      
    } catch (error) {
      console.error('Erro ao adicionar meta:', error);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await deleteGoal(id);
      await fetchMetas();
    } catch (error) {
      console.error('Erro ao deletar meta:', error);
    }
  };

  return (
    <div className="content">
      {showPopup && (
        <div className="popup">
          <div className="popup-content bouncy">
            <h2>Nova Meta +</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Nome da Meta
                <input type="text" name="nome" value={novaMeta.nome} onChange={handleInputChange} />
              </label>
              <label>
                Objetivo (em R$)
                <input type="number" id="objetivo" name="objetivo" value={novaMeta.objetivo} onChange={handleInputChange} />
              </label>
              <label htmlFor="metas">Período</label>
              <select id="metas" name="periodo" value={novaMeta.periodo} onChange={handleInputChange}>
                <option value="" disabled>Escolha o Período</option>
                <option value="semanal">Meta Semanal</option>
                <option value="mensal">Meta Mensal</option>
              </select>
              <button className="registrar" type="submit">Adicionar Meta</button>
            </form>
            <span className="close" onClick={handleClosePopup}>&times;</span>
          </div>
        </div>
      )}
      <div className="Area-Metas">
        <h1>Minhas Metas</h1>
        {metas.length > 0 ? (
          <div className="MinhasMetas">
            <ul>
              {metas.map((meta) => (
                <li key={meta.id} className="meta-item">
                  <div className="meta-details">
                    <strong>Nome:</strong> {meta.nome} <br />
                    <strong>Objetivo:</strong> R$ {meta.objetivo} <br />
                    <strong>Período:</strong> {meta.periodo}
                    <br />
                    <strong>Data de Criação:</strong> {new Date(meta.dataCriacao).toLocaleString()}
                    <div className="progress-container">
                      <div className="progress-bar" style={{ width: `${meta.progresso}%` }}>
                        <span>{meta.progresso.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                  <button className="delete-button" onClick={() => handleDeleteGoal(meta.id)}>
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className='Box-sem-metas'>
            <p>Nenhuma meta registrada ainda. Clique no botão abaixo para adicionar uma nova meta.</p>
          </div>
        )}
        <p>Experimente criar novas metas e ver seus lucros de perto...</p>
        <button
          type="button"
          className="novaMeta-button"
          id="botaoNovaMeta"
          onClick={handleNovaMetaClick}
        >
          +
        </button>
        <Link to="/">
          <button className="metas-voltar-button">
            <i className="fas fa-chevron-left"></i><strong> Voltar </strong>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MinhasMetas;
