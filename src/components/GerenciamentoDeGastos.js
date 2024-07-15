import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Importe seu arquivo CSS principal aqui

const GerenciamentoDeGastos = () => (
  <div className="content">
    <h1>Gerenciamento de Gastos</h1>
    <p>Conteúdo da página Gerenciamento de Gastos</p>
    
    <Link to="/">
      <button className="app-button">
       <i className="fas fa-chevron-left"></i><strong> Voltar </strong>
      </button>
    </Link>



  </div>
);

export default GerenciamentoDeGastos;
