import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { ShoppingBag, FolderOpen } from 'lucide-react';

export default function Home() {
  const username = "Olivia"; // Por ahora estático, preparado para cuando haya sesiones
  
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    isLoading: true
  });

  useEffect(() => {
    fetch('http://localhost:3000/api/stats')
      .then(res => {
        if (!res.ok) throw new Error('Error fetching stats');
        return res.json();
      })
      .then(data => {
        setStats({
          products: data.totalProducts,
          categories: data.totalCategories,
          isLoading: false
        });
      })
      .catch(error => {
        console.error("Error fetching stats:", error);
        setStats(prev => ({ ...prev, isLoading: false }));
      });
  }, []);

  return (
    <div className="home-container">
      <header className="page-header animate-fade-in">
        <div>
          <h1 className="text-gradient-rainbow" style={{ fontSize: '1.8rem', fontWeight: '500' }}>
            ¡Hola {username}!
          </h1>
        </div>
      </header>

      <div className="summary-blocks-container">
        {/* Bloque de Productos */}
        <div className="summary-block glass-panel animate-scale-up" style={{ animationDelay: '0.1s' }}>
          <div className="summary-info">
            <ShoppingBag className="summary-icon" />
            <span className="summary-text">
              {stats.isLoading ? '...' : stats.products} Productos
            </span>
          </div>
          <div className="summary-actions">
            <Link to="/products" className="btn-action">Ver Listado</Link>
            <Link to="/products/new" className="btn-action btn-primary">Agregar Producto</Link>
          </div>
        </div>

        {/* Bloque de Categorías */}
        <div className="summary-block glass-panel animate-scale-up" style={{ animationDelay: '0.2s' }}>
          <div className="summary-info">
            <FolderOpen className="summary-icon" />
            <span className="summary-text">
              {stats.isLoading ? '...' : stats.categories} Categorías
            </span>
          </div>
          <div className="summary-actions">
            <Link to="/categories" className="btn-action">Ver Listado</Link>
            <Link to="/categories/new" className="btn-action btn-primary">Agregar Categoría</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
