import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductsList.css';
import { Plus, Search, ChevronRight } from 'lucide-react';

// Sub-componente para manejar el estado de carga (skeleton) de las imágenes
const ProductImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className={`product-image-container ${loaded ? 'loaded' : 'loading'}`}>
      <img 
        src={src} 
        alt={alt} 
        className="product-image"
        // Evento nativo del DOM: Cuando la imagen termina de descargarse, cambia el estado
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

// Función helper para resolver URLs relativas vs absolutas de las imágenes almacenadas
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  // Si la imagen ya viene de internet (ej. base de datos externa), la devolvemos igual
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Si es local, le anteponemos el origen de nuestro servidor Backend de Node.js
  return `http://localhost:3000${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  
  // Hook de React Router para navegación programática (sin usar <Link>)
  const navigate = useNavigate();

  // Petición inicial para cargar el catálogo completo
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

  // Búsqueda del lado del cliente (Client-Side Filtering)
  const filteredProducts = products.filter(p => {
    const term = searchTerm.toLowerCase();
    // Verifica coincidencias en Nombre, Categoría o Descripción (Operador OR)
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
          {/* Barra de búsqueda interactiva y colapsable */}
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
              // Data binding bidireccional (Controlado por React)
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
          // Iteramos sobre "filteredProducts" (los filtrados), no sobre "products" (el original)
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