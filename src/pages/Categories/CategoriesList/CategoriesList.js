import React from 'react';
import { Link } from 'react-router-dom';
import './CategoriesList.css';
import { Plus, Eye, Edit3, Trash2, Smartphone, Volume2, Shirt, Keyboard, Home } from 'lucide-react';

export default function CategoriesList() {
  const mockCategories = [
    { id: 1, name: 'Electrónica', slug: 'electronica', count: 124, status: 'Activo', icon: <Smartphone size={24} /> },
    { id: 2, name: 'Audio', slug: 'audio', count: 42, status: 'Activo', icon: <Volume2 size={24} /> },
    { id: 3, name: 'Indumentaria', slug: 'indumentaria', count: 85, status: 'Activo', icon: <Shirt size={24} /> },
    { id: 4, name: 'Accesorios', slug: 'accesorios', count: 56, status: 'Activo', icon: <Keyboard size={24} /> },
    { id: 5, name: 'Hogar', slug: 'hogar', count: 35, status: 'Inactivo', icon: <Home size={24} /> },
  ];

  return (
    <div className="categories-list-container">
      {/* Component Name Placeholder (Styled) */}
      <div className="component-placeholder-tag">Component: CategoriesList</div>

      <header className="page-header animate-fade-in">
        <div>
          <h1 className="text-gradient-purple">Módulo de Categorías</h1>
          <p className="subtitle">Administrá las divisiones lógicas de tus productos para facilitar la navegación en la tienda.</p>
        </div>
        <button className="glow-btn add-category-btn">
          <Plus size={18} /> Crear Categoría
        </button>
      </header>

      {/* Grid of Categories Cards */}
      <div className="categories-grid animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {mockCategories.map((c, idx) => (
          <div key={c.id} className="category-card glass-panel animate-scale-up" style={{ animationDelay: `${idx * 0.08}s` }}>
            <div className="category-card-header">
              <div className="category-icon-wrapper">
                {c.icon}
              </div>
              <span className={`badge ${c.status === 'Activo' ? 'badge-success' : 'badge-danger'}`}>
                {c.status}
              </span>
            </div>
            
            <div className="category-card-body">
              <h3>{c.name}</h3>
              <p className="slug-text">slug: {c.slug}</p>
              <div className="product-count-bar">
                <span>{c.count} productos asociados</span>
              </div>
            </div>

            <div className="category-card-footer">
              <Link to={`/categories/${c.id}`} className="footer-action-btn view">
                <Eye size={16} /> Ver
              </Link>
              <Link to={`/categories/${c.id}`} className="footer-action-btn edit">
                <Edit3 size={16} /> Editar
              </Link>
              <button className="footer-action-btn delete">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
