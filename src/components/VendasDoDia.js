import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { addSale } from '../indexedDB';
import '../App.css';

const VendasDoDia = () => {
  const [formData, setFormData] = useState({
    sanduiches: '',
    caldo: '',
    cafe: '',
    date: '',
  });

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
    await addSale(formData);
    alert('Dados salvos com sucesso!');
    setFormData({
      sanduiches: '',
      caldo: '',
      cafe: '',
      date: '',
    });
  };

  return (
    <div className="content vendasdodia-container">
      <h1>Vendas do Dia</h1>
      <form onSubmit={handleSubmit} className="vendas-form">
        <label>
          Sanduíche:
          <input 
            type="number" 
            name="sanduiches" 
            value={formData.sanduiches} 
            onChange={handleChange} 
          />
        </label>

        <label>
          Caldo:
          <input 
            type="number" 
            name="caldo" 
            value={formData.caldo} 
            onChange={handleChange} 
          />
        </label>

        <label>
          Café:
          <input 
            type="number" 
            name="cafe" 
            value={formData.cafe} 
            onChange={handleChange} 
          />
        </label>

        <label>
          Data:
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange} 
          />
        </label>
        <div className='vendas-buttons'>
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

export default VendasDoDia;
