import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const ComemorationPopup = ({ onClose }) => {
  return (
    <div className="popup100-container">
      <div className="popup100">
        <h2>Parabéns, você bateu uma meta!</h2>
        <div className="button-container">
          <Link to="/minhasmetas" className="popup100-button">
            Confira já
          </Link>
          <button className="popup100-button" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComemorationPopup;
