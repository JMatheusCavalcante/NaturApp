import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Importe seu arquivo CSS principal aqui

const MinhasMetas = () => (
  <div className="content">
    <h1>Minhas Metas</h1>
    <p>Conteúdo da página Minhas Metas</p>
    
    <Link to="/">
      <button className="app-button">
       <i className="fas fa-chevron-left"></i><strong> Voltar </strong>
      </button>
    </Link>



  </div>
);

export default MinhasMetas;
