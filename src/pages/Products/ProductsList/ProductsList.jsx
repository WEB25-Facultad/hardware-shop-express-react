import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductsList.css';
import { Plus, Search, ChevronRight } from 'lucide-react';

const ProductImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className={`product-image-container ${loaded ? 'loaded' : 'loading'}`}>
      <img 
        src={src} 
        alt={alt} 
        className="product-image"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `http://localhost:3000${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/api/products', {
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(p => {
    const term = searchTerm.toLowerCase();
    const nameMatch = p.name?.toLowerCase().includes(term);
    const categoryMatch = p.category?.toLowerCase().includes(term);
    const descriptionMatch = p.description?.toLowerCase().includes(term);
    
    return nameMatch || categoryMatch || descriptionMatch;
  });

  return (
    <div className="products-list-container">
      <header className="products-header">
        <h1 className="products-title">Productos</h1>
        
        <div className="header-actions">
          <div className={`search-wrapper ${isSearchExpanded ? 'expanded' : ''}`}>
            <Search 
              className="search-icon" 
              size={18} 
              onClick={() => setIsSearchExpanded(true)}
            />
            <input 
              type="text" 
              placeholder="Buscar productos" 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={() => { if(!searchTerm) setIsSearchExpanded(false); }}
            />
          </div>
          
          <Link to="/products/new" className="btn-add">
            <Plus size={20} />
            <span className="btn-add-text">Agregar Producto</span>
          </Link>
        </div>
      </header>

      <div className="products-list">
        {isLoading ? (
          <div className="loading-state">Cargando...</div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div 
              key={p.id} 
              className="product-card"
              onClick={() => navigate(`/products/${p.id}`)}
            >
              <ProductImage 
                src={getImageUrl(p.image)} 
                alt={p.name} 
              />
              <div className="product-info">
                <span className="product-name">{p.name}</span>
                <span className="product-id">#{p.id}</span>
              </div>
              <ChevronRight className="product-chevron" size={20} />
            </div>
          ))
        ) : (
          <div className="empty-state">No se encontraron productos.</div>
        )}
      </div>
    </div>
  );
}
