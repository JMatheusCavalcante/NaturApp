import React, { useState, useEffect } from 'react';
/* eslint-disable-next-line no-unused-vars */
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import VendasDoDia from './components/VendasDoDia';
import MinhasMetas from './components/MinhasMetas';
import GerenciamentoDeGastos from './components/GerenciamentoDeGastos';
import Historico from './components/Historico';
import './App.css'; // Importe seu arquivo CSS principal aqui

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula um tempo de carregamento
    setTimeout(() => {
      setLoading(false); // Define loading como false após 2 segundos
    }, 2000);
  }, []);

  return (
    <Router>
      <div className="App">
        {loading ? (
          <div className="loading-overlay">
            <div className="loader"></div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vendasdodia" element={<VendasDoDia />} />
            <Route path="/minhasmetas" element={<MinhasMetas />} />
            <Route path="/gerenciamentodegastos" element={<GerenciamentoDeGastos />} />
            <Route path="/historico" element={<Historico />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
