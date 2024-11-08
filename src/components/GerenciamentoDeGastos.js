import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; 
import { addExpense } from '../indexedDB'; 

const GerenciamentoDeGastos = () => {
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');

  const handleSave = async () => {
    const expense = { valor, descricao, data };
    await addExpense(expense);
    setValor('');
    setDescricao('');
    setData('');
    handleButtonClick();
  };

  const [buttonActive, setButtonActive] = useState(false);

  // Função Que é chamada quando o form é enviado
  // Ela Define buttonActive 'true' e após 2 seg para false
  const handleButtonClick = () => {
    setButtonActive(true);
    setTimeout(() => {
      setButtonActive(false);
    }, 2000);
  };




  return (
    <div className="content">
      
      <form className='form-gastos' onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
      <h1>Gerenciamento de Gastos</h1>
        <div>
          <label>Investimento</label>
          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>
        <div>
          <label>Descrição</label>
          <input className='input-descricao'
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
        <div>
          <label>Data</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
        
        <div className='botoes-gastos'>
          <button type="submit" className={`salvar-button ${buttonActive ? 'active' : ''}`}>
            
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

export default GerenciamentoDeGastos;
