import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Importe seu arquivo CSS principal aqui



const MinhasMetas = () => (
  <div className="content">
    <div className='Area-Metas'>
      
      
      <div className='MinhasMetas'>
        <h1>Minhas Metas</h1> 



      </div>
      
      
      


      
      <p>Experimente  criar novas metas e ver seus lucros de perto...</p>
      
      <button type='submit' className='novaMeta-button' id='botaoNovaMeta'>+</button>
      
            
      
      
      
      <Link to="/">
        <button className="metas-voltar-button">
        <i className="fas fa-chevron-left"></i><strong> Voltar </strong>
        </button>
      </Link>
    </div>
  </div>
);

export default MinhasMetas;
