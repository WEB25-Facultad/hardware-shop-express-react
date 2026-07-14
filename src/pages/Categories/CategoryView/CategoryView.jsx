import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './CategoryView.css';
import { ArrowLeft, Save, Folder, Check, AlertCircle } from 'lucide-react';

export default function CategoryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  const mockCategories = [
    { id: 1, name: 'Electrónica', slug: 'electronica', description: 'Dispositivos electrónicos, gadgets, teléfonos inteligentes y computadoras de última generación.', status: 'Activo' },
    { id: 2, name: 'Audio', slug: 'audio', description: 'Equipos de audio premium, auriculares inalámbricos, altavoces y accesorios de sonido.', status: 'Activo' },
    { id: 3, name: 'Indumentaria', slug: 'indumentaria', description: 'Ropa de moda para hombres y mujeres, accesorios textiles y prendas premium.', status: 'Activo' },
    { id: 4, name: 'Accesorios', slug: 'accesorios', description: 'Accesorios de computación, teclados mecánicos, ratones y cables de alta calidad.', status: 'Activo' },
    { id: 5, name: 'Hogar', slug: 'hogar', description: 'Artículos para el hogar, cafeteras, electrodomésticos de cocina y decoración.', status: 'Inactivo' },
  ];

  const categoryData = mockCategories.find(c => c.id === parseInt(id)) || {
    id: 'Nueva',
    name: '',
    slug: '',
    description: '',
    status: 'Activo',
  };

  const [formData, setFormData] = useState(categoryData);

  useEffect(() => {
    if (id) {
      const found = mockCategories.find(c => c.id === parseInt(id));
      if (found) {
        setFormData(found);
      }
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Automatically generate slug from name
      slug: name === 'name' ? value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-') : prev.slug
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      navigate('/categories');
    }, 1500);
  };

  return (
    <div className="category-view-container">
      {/* Component Name Placeholder (Styled) */}
      <div className="component-placeholder-tag">Component: CategoryView</div>

      <header className="page-header animate-fade-in">
        <div className="back-link-wrapper">
          <Link to="/categories" className="back-link">
            <ArrowLeft size={16} /> Volver a Categorías
          </Link>
          <div className="title-section">
            <h1 className="text-gradient-purple">
              {id === 'new' ? 'Nueva Categoría' : `Editar Categoría #${id}`}
            </h1>
            <p className="subtitle">Editá los detalles estructurales de la categoría de productos.</p>
          </div>
        </div>
      </header>

      <div className="category-view-layout">
        {/* Form container */}
        <form onSubmit={handleSave} className="glass-panel category-form animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h3 className="section-title">Detalles de Categoría</h3>

          <div className="form-group">
            <label htmlFor="name">Nombre de Categoría</label>
            <input 
              type="text" 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. Electrodomésticos"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="slug">Slug Url (Auto-generado)</label>
            <input 
              type="text" 
              id="slug"
              name="slug"
              value={formData.slug}
              readOnly
              className="readonly-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Estado de Categoría</label>
            <select 
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Activo">Activa (Pública en tienda)</option>
              <option value="Inactivo">Inactiva (Oculta de la tienda)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea 
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describí los productos que componen esta categoría..."
              required
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/categories')} className="cancel-btn">
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
        </form>

        {/* Preview / Instructions card */}
        <div className="glass-panel preview-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="folder-illustration">
            <Folder size={64} className="illustration-icon" />
          </div>
          
          <h4 className="preview-heading">Vista Previa de Organización</h4>
          <p className="preview-description">
            Al editar esta categoría, afectarás a todos los productos que están linkeados. Asegurate de que el nombre sea intuitivo para los clientes.
          </p>

          <div className="instruction-box glass-panel">
            <AlertCircle className="instruction-icon" size={20} />
            <div>
              <h5>Reglas SEO de Categorías</h5>
              <p>El slug URL se genera automáticamente en minúsculas y sin caracteres especiales para optimizar el posicionamiento en buscadores.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
