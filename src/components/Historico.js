import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllSales, deleteSale } from '../indexedDB';
import '../App.css';

const Historico = () => {
  const [sales, setSales] = useState([]);
  const [dailyTotal, setDailyTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const allSales = await getAllSales();
      const salesWithTotal = allSales.map(sale => ({
        ...sale,
        total: sale.sanduiches * 5 + sale.caldo * 5 + sale.cafe * 2 // Ajuste os preços conforme necessário
      }));

      setSales(salesWithTotal);
      calculateDailyTotal(salesWithTotal);
    };
    fetchData();
  }, []);

  const handleDeleteSale = async (id) => {
    await deleteSale(id);
    const updatedSales = await getAllSales();
    const salesWithTotal = updatedSales.map(sale => ({
      ...sale,
      total: sale.sanduiches * 5 + sale.caldo * 5 + sale.cafe * 2 // Ajuste os preços conforme necessário
    }));

    setSales(salesWithTotal);
    calculateDailyTotal(salesWithTotal);
  };

  const calculateDailyTotal = (sales) => {
    const total = sales.reduce((acc, sale) => acc + sale.total, 0);
    setDailyTotal(total);
  };

  return (
    <div className="content historico-container">
      <div className="table-container">
        <div className="historico-vendas">
          <h3>Histórico de Vendas</h3>
          <div className="table-scrollable">
            <table className="historico-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Sanduíches</th>
                  <th>Caldo</th>
                  <th>Café</th>
                  <th>Total</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="historico-row">
                    <td>{sale.date}</td>
                    <td>{sale.sanduiches}</td>
                    <td>{sale.caldo}</td>
                    <td>{sale.cafe}</td>
                    <td>{"$" + sale.total.toFixed(2)}</td> {/* Formatação para 2 casas decimais */}
                    <td>
                      <button className="delete-button" onClick={() => handleDeleteSale(sale.id)}>
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="vendas-totais">
          <h4>Total de Ganhos Registrados: $ {dailyTotal.toFixed(2)}</h4> {/* Exibindo o total diário */}
        </div>
      </div>

      <div className="historico-gastos">
        <h3>Histórico de Gastos</h3>
        <table className="historico-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Valor</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {/* Adicione as linhas de despesas aqui */}
          </tbody>
        </table>
      </div>

      <Link to="/" className="historico-link">
        <button className="app-button">
          <i className="fas fa-chevron-left"></i><strong> Voltar </strong>
        </button>
      </Link>
    </div>
  );
};

export default Historico;
