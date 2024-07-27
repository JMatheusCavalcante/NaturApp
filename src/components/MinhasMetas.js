import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addGoal, getAllGoals, deleteGoal } from '../indexedDB';
import '../App.css';

const MinhasMetas = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [metas, setMetas] = useState([]);
  const [novaMeta, setNovaMeta] = useState({ nome: '', objetivo: '', periodo: '' });

  useEffect(() => {
    const fetchMetas = async () => {
      const allMetas = await getAllGoals();
      setMetas(allMetas.reverse());
    };

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
    await addGoal(novaMeta);
    const updatedMetas = await getAllGoals();
    setMetas(updatedMetas.reverse()); // Atualiza a lista de metas
    setNovaMeta({ nome: '', objetivo: '', periodo: '' });
    setShowPopup(false);
  };

  const handleDeleteGoal = async (id) => {
    console.log(`Tentando deletar meta com id: ${id}`); // Log do ID da meta
    await deleteGoal(id);
    const updatedMetas = await getAllGoals();
    console.log('Metas atualizadas após deleção:', updatedMetas); // Log das metas atualizadas
    setMetas(updatedMetas.reverse());
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
                Objetivo
                <input type="text" id="objetivo" name="objetivo" value={novaMeta.objetivo} onChange={handleInputChange} />
              </label>
              <label htmlFor="metas">Período</label>
              <select id="metas" name="periodo" value={novaMeta.periodo} onChange={handleInputChange}>
              <option value="" disabled selected>Escolha o Período</option>
                <option value="diaria">Meta Diária</option>
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
              {metas.map((meta, index) => (
                <li key={index}>
                  <div className="meta-details">
                    <strong>Nome:</strong> {meta.nome} <br />
                    <strong>Objetivo:</strong> {meta.objetivo} <br />
                    <strong>Período:</strong> {meta.periodo}
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
