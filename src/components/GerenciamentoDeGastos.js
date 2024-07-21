import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Importe seu arquivo CSS principal aqui
import { addExpense } from '../indexedDB'; // Importe a função addExpense

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
  };

  return (
    <div className="content">
      
      <form className='form-gastos' onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
      <h1>Gerenciamento de Gastos</h1>
        <div>
          <label>Investimento:</label>
          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>
        <div>
          <label>Descrição:</label>
          <input className='input-descricao'
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
        <div>
          <label>Data:</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
        <div className='botoes-gastos'>
          <button type="submit" className="app-button">
          <i className="fas fa-save"></i><strong> Salvar </strong>
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
