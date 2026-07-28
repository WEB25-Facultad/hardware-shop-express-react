import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './ProductView.css';
import { ArrowLeft, Save, Trash2, Plus, Minus, Image, Check } from 'lucide-react';

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `http://localhost:3000${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export default function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: 0,
    stock: 0,
    description: '',
    image: '',
    category: '',
    tienda: 'Olivia Store'
  });
  
  const [originalData, setOriginalData] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch categories from API
  useEffect(() => {
    fetch('http://localhost:3000/api/categories')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar las categorías');
        return res.json();
      })
      .then(data => {
        setCategories(data);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
      });
  }, []);

  // Fetch product from API
  useEffect(() => {
    if (!isNew) {
      setIsLoading(true);
      fetch(`http://localhost:3000/api/products/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Error al cargar el producto');
          return res.json();
        })
        .then(data => {
          const product = {
            id: data.id,
            name: data.name || '',
            price: data.price || 0,
            stock: data.stock || 0,
            description: data.description || '',
            image: data.image || '',
            category: data.category || 'Otros',
            tienda: data.tienda || 'Olivia Store'
          };
          setFormData(product);
          setOriginalData(product);
          setIsLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStockChange = (amount) => {
    setFormData(prev => {
      const currentStock = parseInt(prev.stock, 10) || 0;
      const newStock = Math.max(0, currentStock + amount);
      return {
        ...prev,
        stock: newStock
      };
    });
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
    } else {
      setFormData({
        id: '',
        name: '',
        price: 0,
        stock: 0,
        description: '',
        image: '',
        category: '',
        tienda: 'Olivia Store'
      });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.name || formData.name.trim() === '') {
      alert('El nombre es requerido');
      return;
    }
    
    const parsedPrice = parseInt(formData.price, 10);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      alert('El precio debe ser un número entero mayor o igual a 0');
      return;
    }

    const parsedStock = parseInt(formData.stock, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
      alert('El stock debe ser un número entero mayor o igual a 0');
      return;
    }

    const url = isNew ? 'http://localhost:3000/api/products' : `http://localhost:3000/api/products/${id}`;
    const method = isNew ? 'POST' : 'PUT';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        price: parsedPrice,
        stock: parsedStock
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al guardar el producto');
        return res.json();
      })
      .then(data => {
        setIsSaved(true);
        // Actualizar datos originales
        setOriginalData({
          ...formData,
          price: parsedPrice,
          stock: parsedStock
        });
        setTimeout(() => {
          setIsSaved(false);
          navigate('/products');
        }, 1500);
      })
      .catch(err => {
        alert(err.message);
      });
  };

  const handleDelete = () => {
    if (isNew) {
      navigate('/products');
      return;
    }

    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'DELETE'
      })
        .then(res => {
          if (!res.ok) throw new Error('Error al eliminar el producto');
          return res.json();
        })
        .then(() => {
          navigate('/products');
        })
        .catch(err => {
          alert(err.message);
        });
    }
  };

  if (isLoading) {
    return <div className="product-view-loading">Cargando producto...</div>;
  }

  if (error) {
    return (
      <div className="product-view-error">
        <h3>Error</h3>
        <p>{error}</p>
        <Link to="/products" className="back-link">
          <ArrowLeft size={16} /> Volver a Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="product-view-container">
      <div className="component-placeholder-tag">Component: ProductView</div>

      {/* Header */}
      <header className="product-view-header animate-fade-in">
        <div className="breadcrumb">
          <Link to="/products" className="breadcrumb-main">Productos</Link>
          <span className="breadcrumb-separator">&gt;</span>
          <span className="breadcrumb-active">#{id || ''}</span>
        </div>
        <button type="button" onClick={handleDelete} className="delete-header-btn">
          <Trash2 size={16} />
          Eliminar
        </button>
      </header>

      {/* Summary Card */}
      <div className="product-summary-card glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="summary-image-wrapper">
          {formData.image ? (
            <img src={getImageUrl(formData.image)} alt={formData.name || 'Preview'} />
          ) : (
            <div className="summary-image-placeholder">
              <Image size={24} />
            </div>
          )}
        </div>
        <div className="summary-details">
          <h2 className="summary-title">{formData.name || 'Sin nombre'}</h2>
          <div className="summary-meta-row">
            <div className="summary-meta-item">
              <span className="meta-value">${(parseInt(formData.price) || 0).toLocaleString()}</span>
              <span className="meta-label">PRECIO</span>
            </div>
            <div className="summary-meta-item">
              <span className="meta-value">{(parseInt(formData.stock) || 0).toLocaleString()}</span>
              <span className="meta-label">STOCK DISPONIBLE</span>
            </div>
            
            <Link to="/profile" className="summary-store-badge">
              <div className="store-avatar">
                {formData.tienda ? formData.tienda.substring(0, 2).toUpperCase() : 'ST'}
              </div>
              <span className="store-name">{formData.tienda || 'Olivia Store'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Forms Section */}
      <div className="product-forms-section animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <form onSubmit={handleSave} className="product-edit-form">
          
          {/* Información Panel */}
          <div className="glass-panel form-panel">
            <h3 className="panel-title">Información</h3>
            
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input 
                type="text" 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre del producto"
                required
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="price">Valor</label>
                <input 
                  type="number" 
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Precio"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock</label>
                <div className="stock-input-wrapper">
                  <button type="button" onClick={() => handleStockChange(-1)} className="stock-btn">
                    <Minus size={14} />
                  </button>
                  <input 
                    type="number" 
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Stock"
                    required
                  />
                  <button type="button" onClick={() => handleStockChange(1)} className="stock-btn">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="tienda">Tienda</label>
                <select 
                  id="tienda"
                  name="tienda"
                  value={formData.tienda}
                  onChange={handleChange}
                >
                  <option value="Select" disabled>Select</option>
                  <option value="Olivia Store">Olivia Store</option>
                  <option value="Havanna SL">Havanna SL</option>
                  <option value="Santander Store">Santander Store</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="category">Categoría</label>
                <select 
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="" disabled>Seleccione una categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                  <option value="Otros">Otros</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Descripción</label>
              <textarea 
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descripción del producto"
              ></textarea>
            </div>
          </div>

          {/* Galería de Imágenes Panel */}
          <div className="glass-panel form-panel">
            <h3 className="panel-title">Galería de Imágenes</h3>
            
            <div className="form-group">
              <label htmlFor="image">Nueva Imagen</label>
              <input 
                type="text" 
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Pegá el link de la imagen aquí..."
              />
            </div>

            {formData.image && (
              <div className="gallery-preview-wrapper">
                <div className="gallery-preview-item">
                  <img src={getImageUrl(formData.image)} alt="Preview" />
                  <button type="button" onClick={handleRemoveImage} className="remove-image-btn" title="Eliminar imagen">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancelar
            </button>
            <button type="submit" className="glow-btn save-btn">
              {isSaved ? (
                <>
                  <Check size={18} /> Guardado con éxito
                </>
              ) : (
                <>
                  <Save size={18} /> Guardar
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
