import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // CSS principal 

const Home = () => (
  <div className="App-header">
    <div className="main-container">
      <h1>Seja Bem-vindo!</h1>
      <h2>Aqui você pode gerenciar seu negócio, criar metas e mais.</h2>
      
      
      <div className="button-container">  
        
        <Link to="/vendasdodia">
          <button className="app-button">
            <i className="fas fa-chart-line"></i><strong> Vendas do Dia </strong>
          </button>
        </Link>

        <Link to="/minhasmetas">
          <button className="app-button">
            <i className="fas fa-bullseye"></i> <strong>Minhas Metas</strong>
          </button>
        </Link>

        <Link to="/gerenciamentodegastos">
          <button className="app-button">
            <i className="fas fa-credit-card"></i><strong> Gerenciamento de Gastos</strong>
          </button>
        </Link>

        <Link to="/historico">
          <button className="app-button">
            <i className="fas fa-history"></i> <strong>Histórico</strong>
          </button>
        </Link>
      </div>
    
    </div>
    <div className='footer-container'>
    <footer className="footer">
        <h4>Criado por Matheus Cavalcante</h4>
    </footer>
    </div>
  </div>



);

export default Home;
