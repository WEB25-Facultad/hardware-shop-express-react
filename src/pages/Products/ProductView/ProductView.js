import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './ProductView.css';
import { ArrowLeft, Save, ShieldAlert, Sparkles, Image, Check } from 'lucide-react';

export default function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  // Mock database logic to simulate finding by id
  const mockProducts = [
    { id: 1, name: 'iPhone 15 Pro Max', category: 'Electrónica', price: '1299.00', stock: 15, description: 'Pantalla Super Retina XDR de 6.7 pulgadas con ProMotion, Chip A17 Pro y un sistema de cámaras Pro sumamente versátil.', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500' },
    { id: 2, name: 'Auriculares Sony WH-1000XM4', category: 'Audio', price: '349.99', stock: 4, description: 'Auriculares inalámbricos con Noise Cancelling líder del sector, hasta 30 horas de duración de batería y controles táctiles.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' },
    { id: 3, name: 'Remera de Algodón Premium', category: 'Indumentaria', price: '29.90', stock: 120, description: 'Remera clásica confeccionada 100% en algodón peinado de primera calidad. Corte regular, fresca y cómoda.', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500' },
    { id: 4, name: 'Teclado Mecánico Keychron Q1', category: 'Accesorios', price: '189.00', stock: 0, description: 'Teclado mecánico custom Q1 con chasis de aluminio CNC completo, distribución del 75%, teclas hot-swappable e iluminación RGB.', image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500' },
    { id: 5, name: 'Cafetera Espresso Barista', category: 'Hogar', price: '599.00', stock: 8, description: 'Cafetera espresso manual con molinillo integrado, control de temperatura digital PID y vaporizador de alta presión.', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500' },
  ];

  const productData = mockProducts.find(p => p.id === parseInt(id)) || {
    id: 'Nuevo',
    name: '',
    category: 'Electrónica',
    price: '0.00',
    stock: 0,
    description: '',
    image: '',
  };

  const [formData, setFormData] = useState(productData);

  useEffect(() => {
    if (id) {
      const found = mockProducts.find(p => p.id === parseInt(id));
      if (found) {
        setFormData(found);
      }
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      navigate('/products');
    }, 1500);
  };

  return (
    <div className="product-view-container">
      {/* Component Name Placeholder (Styled) */}
      <div className="component-placeholder-tag">Component: ProductView</div>

      <header className="page-header animate-fade-in">
        <div className="back-link-wrapper">
          <Link to="/products" className="back-link">
            <ArrowLeft size={16} /> Volver a Productos
          </Link>
          <div className="title-section">
            <h1 className="text-gradient-purple">
              {id === 'new' ? 'Nuevo Producto' : `Editar Producto #${id}`}
            </h1>
            <p className="subtitle">Configurá las propiedades del producto y hacé cambios en tiempo real.</p>
          </div>
        </div>
      </header>

      {/* Main Content Form */}
      <form onSubmit={handleSave} className="product-form-layout">
        {/* Left column: inputs */}
        <div className="glass-panel form-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h3 className="section-title">Información General</h3>
          
          <div className="form-group">
            <label htmlFor="name">Nombre del Producto</label>
            <input 
              type="text" 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. iPhone 15 Pro Max"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Categoría</label>
              <select 
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Electrónica">Electrónica</option>
                <option value="Audio">Audio</option>
                <option value="Indumentaria">Indumentaria</option>
                <option value="Accesorios">Accesorios</option>
                <option value="Hogar">Hogar</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="price">Precio ($)</label>
              <input 
                type="number" 
                step="0.01"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock Disponible</label>
              <input 
                type="number" 
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción Detallada</label>
            <textarea 
              id="description"
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detallá las características más importantes de este producto..."
              required
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/products')} className="cancel-btn">
              Cancelar
            </button>
            <button type="submit" className="glow-btn save-btn">
              {isSaved ? (
                <>
                  <Check size={18} /> Guardado con éxito
                </>
              ) : (
                <>
                  <Save size={18} /> Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right column: Image & Metadata */}
        <div className="glass-panel info-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="section-title">Multimedia y Estado</h3>
          
          <div className="image-preview-wrapper">
            {formData.image ? (
              <img src={formData.image} alt={formData.name || 'Preview'} className="image-preview" />
            ) : (
              <div className="image-placeholder">
                <Image size={48} className="placeholder-icon" />
                <span>Sin imagen disponible</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="image">URL de Imagen</label>
            <input 
              type="text" 
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          {parseInt(formData.stock) === 0 && (
            <div className="status-warning glass-panel">
              <ShieldAlert className="warning-icon" size={24} />
              <div>
                <h4>Producto sin stock</h4>
                <p>Este producto no estará visible para la compra en la tienda de clientes hasta que se incremente el stock.</p>
              </div>
            </div>
          )}

          <div className="metadata-panel">
            <div className="meta-row">
              <span className="meta-label">Última modificación:</span>
              <span className="meta-val">Hoy, hace 2 horas</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">ID de Registro:</span>
              <span className="meta-val">#{formData.id}</span>
            </div>
            <div className="meta-row font-glow">
              <span className="meta-label">Ventas registradas:</span>
              <span className="meta-val highlight">45 unidades</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
