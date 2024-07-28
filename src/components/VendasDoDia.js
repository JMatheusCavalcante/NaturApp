import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addSale, getAllGoals, updateGoalProgress } from '../indexedDB';
import '../App.css';

const VendasDoDia = () => {
  const [formData, setFormData] = useState({
    sanduiches: '',
    caldo: '',
    cafe: '',
    date: '',
  });
  
  const [buttonActive, setButtonActive] = useState(false);
  const [goals, setGoals] = useState([]); // Estado para armazenar as metas

  useEffect(() => {
    const fetchGoals = async () => {
      const allGoals = await getAllGoals();
      setGoals(allGoals);
    };

    fetchGoals();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
    
    // Calcular o total das vendas
    const totalVendas = 
      parseFloat(formData.sanduiches || 0) + 
      parseFloat(formData.caldo || 0) + 
      parseFloat(formData.cafe || 0);

    // Adicionar a venda
    await addSale(formData);
    
    // Atualizar o progresso das metas associadas
    const updatedGoals = goals.map(goal => {
      const novoProgresso = Math.min(100, ((goal.progresso || 0) + totalVendas) / goal.objetivo * 100);
      updateGoalProgress(goal.id, novoProgresso);
      return { ...goal, progresso: novoProgresso };
    });

    setGoals(updatedGoals);
    
    setFormData({
      sanduiches: '',
      caldo: '',
      cafe: '',
      date: '',
    });
    handleButtonClick();
  };
  
  const handleButtonClick = () => {
    setButtonActive(true);
    setTimeout(() => {
      setButtonActive(false);
    }, 2000);
  };

  return (
    <div className="content vendasdodia-container">
      <h1>Vendas do Dia</h1>
      <form onSubmit={handleSubmit} className="vendas-form">
        <label>
          Sanduíche
          <input 
            type="number" 
            name="sanduiches" 
            value={formData.sanduiches} 
            onChange={handleChange} 
          />
        </label>

        <label>
          Caldo
          <input 
            type="number" 
            name="caldo" 
            value={formData.caldo} 
            onChange={handleChange} 
          />
        </label>

        <label>
          Café
          <input 
            type="number" 
            name="cafe" 
            value={formData.cafe} 
            onChange={handleChange} 
          />
        </label>

        <label>
          Data
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange} 
          />
        </label>

        <div className='vendas-buttons'>
          <button
            type="submit"
            className={`salvar-button ${buttonActive ? 'active' : ''}`}>
            <div className="check-box">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M20.292 5.292a1 1 0 0 0-1.414 0L9 15.172 5.122 11.293a1 1 0 1 0-1.414 1.414l4.707 4.707a1 1 0 0 0 1.414 0L20.292 6.706a1 1 0 0 0 0-1.414z"/>
              </svg>
            </div>
            <strong> Salvar </strong>
          </button>

          <Link to="/">
            <button className="app-button">
              <i className="fas fa-chevron-left"></i><strong> Voltar </strong>
            </button>
          </Link>
        </div>
      </form>     
    </div>
  );
};

export default VendasDoDia;
