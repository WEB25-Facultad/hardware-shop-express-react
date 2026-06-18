import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductsList.css';
import { Plus, Search, Edit3, Eye, Trash2, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function ProductsList() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const mockProducts = [
    { id: 1, name: 'iPhone 15 Pro Max', category: 'Electrónica', price: '$1,299.00', stock: 15, status: 'In Stock' },
    { id: 2, name: 'Auriculares Sony WH-1000XM4', category: 'Audio', price: '$349.99', stock: 4, status: 'Low Stock' },
    { id: 3, name: 'Remera de Algodón Premium', category: 'Indumentaria', price: '$29.90', stock: 120, status: 'In Stock' },
    { id: 4, name: 'Teclado Mecánico Keychron Q1', category: 'Accesorios', price: '$189.00', stock: 0, status: 'Out of Stock' },
    { id: 5, name: 'Cafetera Espresso Barista', category: 'Hogar', price: '$599.00', stock: 8, status: 'In Stock' },
  ];

  const filteredProducts = mockProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="products-list-container">
      {/* Component Name Placeholder (Styled) */}
      <div className="component-placeholder-tag">Component: ProductsList</div>

      <header className="page-header animate-fade-in">
        <div className="header-title-wrapper">
          <h1 className="text-gradient-cyan">Listado de Productos</h1>
          <p className="subtitle">Gestioná tu catálogo de productos, precios y niveles de stock actualizados.</p>
        </div>
        <button className="glow-btn add-product-btn">
          <Plus size={18} /> Agregar Producto
        </button>
      </header>

      {/* Filters & Search bar */}
      <div className="table-controls animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="search-bar-wrapper">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o categoría..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button className="filter-options-btn">
          <SlidersHorizontal size={16} /> Filtros
        </button>
      </div>

      {/* Products Table Card */}
      <div className="glass-panel table-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="table-responsive">
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td className="product-id">#{p.id}</td>
                    <td className="product-name-cell">
                      <div className="product-avatar">
                        <Sparkles size={16} className="avatar-icon" />
                      </div>
                      <span className="product-name">{p.name}</span>
                    </td>
                    <td>{p.category}</td>
                    <td className="product-price">{p.price}</td>
                    <td>{p.stock} uds.</td>
                    <td>
                      <span className={`badge ${
                        p.status === 'In Stock' ? 'badge-success' :
                        p.status === 'Low Stock' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="table-actions text-right">
                      <Link to={`/products/${p.id}`} className="action-btn view" title="Ver Detalle">
                        <Eye size={16} />
                      </Link>
                      <Link to={`/products/${p.id}`} className="action-btn edit" title="Editar">
                        <Edit3 size={16} />
                      </Link>
                      <button className="action-btn delete" title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-table-cell">
                    No se encontraron productos que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span className="pagination-info">Mostrando {filteredProducts.length} de {mockProducts.length} productos</span>
          <div className="pagination-controls">
            <button className="pagination-btn" disabled>Anterior</button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn" disabled>Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
}
