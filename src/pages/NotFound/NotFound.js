import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="glass-panel not-found-card animate-scale-up">
        <div className="error-icon-wrapper">
          <AlertCircle size={48} className="error-icon animate-pulse" />
        </div>
        
        <h1 className="error-code text-gradient-rainbow">404</h1>
        <h2 className="error-title">Página no encontrada</h2>
        <p className="error-message">
          La ruta que estás buscando no existe o ha sido movida temporalmente.
        </p>

        <Link to="/" className="glow-btn back-home-btn">
          <ArrowLeft size={18} /> Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
