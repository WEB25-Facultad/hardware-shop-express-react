import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './CategoryView.css';
import { ArrowLeft, Save, Folder, Check, AlertCircle, Trash2, ShieldAlert } from 'lucide-react';

export default function CategoryView() {
  // Extraemos el ID de la URL (ej: /categories/5). Si dice 'new', es creación.
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const isNew = !id || id === 'new';

  // Estado centralizado para manejar todos los campos del formulario
  const [formData, setFormData] = useState({
    id: isNew ? 'Nueva' : id,
    name: '',
    slug: '',
    description: '',
    status: 'Activo',
  });

  // Estados para gestionar la relación Categoría <-> Productos
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hook de Efecto: Se dispara al cargar para buscar datos en la Base de Datos
  useEffect(() => {
    setIsLoading(true);
    
    // Solicitud GET inicial para cargar el listado de productos disponibles
    fetch('http://localhost:3000/api/products')
      .then(res => res.ok ? res.json() : [])
      .then(productsData => {
        setAllProducts(productsData);
        
        // Si es Modo Edición, buscamos los datos específicos de esta categoría
        if (!isNew) {
          fetch(`http://localhost:3000/api/categories/${id}`)
            .then(res => {
              if (!res.ok) throw new Error('Error al cargar la categoría');
              return res.json();
            })
            .then(catData => {
              // Rellenamos el formulario con los datos de la DB
              setFormData({
                id: catData.id,
                name: catData.name || '',
                slug: catData.slug || '',
                description: catData.description || '',
                status: catData.status || 'Activo'
              });
              
              // Filtramos y marcamos automáticamente los productos que ya pertenecen a esta categoría
              const associatedIds = productsData
                .filter(p => p.category === catData.name)
                .map(p => p.id);
              setSelectedProductIds(associatedIds);
              setIsLoading(false);
            })
            .catch(err => {
              setError(err.message);
              setIsLoading(false);
            });
        } else {
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error('Error al cargar los productos para el listado:', err);
        setIsLoading(false);
      });
  }, [id, isNew]);

  // Manejador genérico para Inputs: Actualiza el estado y auto-genera el "slug"
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Si el usuario cambia el Nombre, generamos el Slug de URL en tiempo real
      slug: name === 'name' ? value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-') : prev.slug
    }));
  };

  // Lógica de Checkbox: Agrega o quita IDs del array de productos seleccionados
  const handleProductToggle = (prodId) => {
    setSelectedProductIds(prev => 
      prev.includes(prodId) ? prev.filter(id => id !== prodId) : [...prev, prodId]
    );
  };

  // Función principal de Guardado (Submit)
  const handleSave = (e) => {
    e.preventDefault();

    if (!formData.name || formData.name.trim() === '') {
      alert('El nombre es requerido');
      return;
    }

    // Definición dinámica de URL y Método (POST para Crear, PUT para Editar)
    const url = isNew ? 'http://localhost:3000/api/categories' : `http://localhost:3000/api/categories/${id}`;
    const method = isNew ? 'POST' : 'PUT';

    // 1. Fase Uno: Guardar los detalles de la categoría en SQLite
    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.error || 'Error al guardar la categoría') });
        }
        return res.json();
      })
      .then((savedCat) => {
        const categoryName = formData.name;

        // 2. Fase Dos: Guardado Múltiple de Productos (Promise.all)
        // Mapeamos todos los productos para ver cuáles sufrieron cambios de categoría
        const promises = allProducts.map(prod => {
          const isSelected = selectedProductIds.includes(prod.id);
          const currentCat = prod.category;

          // Escenario A: El producto se tildó ahora, pero antes no estaba en esta categoría
          if (isSelected && currentCat !== categoryName) {
            return fetch(`http://localhost:3000/api/products/${prod.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...prod, category: categoryName })
            });
          // Escenario B: El producto se destildó, pero antes sí estaba en esta categoría
          } else if (!isSelected && currentCat === categoryName) {
            return fetch(`http://localhost:3000/api/products/${prod.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...prod, category: 'Otros' })
            });
          }
          return null; // Si no hubo cambios, no disparamos la petición
        }).filter(Boolean); // Filtramos los nulls

        // Ejecutamos todas las peticiones de actualización de productos en paralelo
        return Promise.all(promises);
      })
      .then(() => {
        // Feedback visual de éxito y redirección
        setIsSaved(true);
        setTimeout(() => {
          setIsSaved(false);
          navigate('/categories');
        }, 1500);
      })
      .catch(err => {
        alert(err.message);
      });
  };

  // Función de Borrado de Categoría
  const handleDelete = () => {
    if (isNew) {
      navigate('/categories');
      return;
    }

    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      fetch(`http://localhost:3000/api/categories/${id}`, {
        method: 'DELETE'
      })
        .then(res => {
          if (!res.ok) throw new Error('Error al eliminar la categoría');
          return res.json();
        })
        .then(() => {
          navigate('/categories');
        })
        .catch(err => {
          alert(err.message);
        });
    }
  };

  // Renderizado condicional mientras carga la DB
  if (isLoading) {
    return <div className="category-view-loading">Cargando categoría y productos...</div>;
  }

  // Renderizado condicional en caso de error
  if (error) {
    return (
      <div className="category-view-error">
        <h3>Error</h3>
        <p>{error}</p>
        <Link to="/categories" className="back-link">
          <ArrowLeft size={16} /> Volver a Categorías
        </Link>
      </div>
    );
  }

  return (
    <div className="category-view-container">
      <div className="component-placeholder-tag">Componente: CategoryView</div>

      <header className="page-header animate-fade-in">
        <div className="back-link-wrapper">
          <Link to="/categories" className="back-link">
            <ArrowLeft size={16} /> Volver a Categorías
          </Link>
          <div className="title-section">
            <h1 className="text-gradient-purple">
              {isNew ? 'Nueva Categoría' : `Editar Categoría #${id}`}
            </h1>
            <p className="subtitle">Configurá la estructura y asociá los productos de tu e-commerce.</p>
          </div>
        </div>
      </header>

      <div className="category-view-layout">
        {/* Formulario conectado al estado "formData" y a la función de guardado "handleSave" */}
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
              placeholder="Ej. Procesadores"
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
              placeholder="Describí la categoría..."
            ></textarea>
          </div>

          {/* SECCIÓN INTERACTIVA: Checkboxes controlados por el estado selectedProductIds */}
          <div className="products-association-section" style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 style={{ color: 'white', marginBottom: '8px', fontSize: '1rem', fontWeight: '600' }}>Asociar Productos</h4>
            <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '15px' }}>Seleccioná los productos que querés incluir dentro de esta categoría:</p>
            
            <div className="products-checklist" style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #333', borderRadius: '8px', padding: '10px', background: '#0a0a0a' }}>
              {allProducts.length > 0 ? (
                allProducts.map(prod => (
                  <label key={prod.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderBottom: '1px solid #111', cursor: 'pointer', color: 'white', fontSize: '0.9rem' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedProductIds.includes(prod.id)}
                      onChange={() => handleProductToggle(prod.id)}
                      style={{ cursor: 'pointer', accentColor: 'var(--primary)' }}
                    />
                    <span>{prod.name} <small style={{ color: '#666' }}>(Cat. actual: {prod.category || 'Ninguna'})</small></span>
                  </label>
                ))
              ) : (
                <p style={{ color: '#666', fontSize: '0.85rem', textAlign: 'center', margin: '20px 0' }}>No hay productos registrados en el sistema.</p>
              )}
            </div>
          </div>

          <div className="form-actions" style={{ marginTop: '25px' }}>
            {!isNew && (
              <button type="button" onClick={handleDelete} className="cancel-btn" style={{ color: '#ef4444', borderColor: '#ef4444' }}>
                <Trash2 size={18} /> Eliminar
              </button>
            )}
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

        {/* Tarjeta de información lateral */}
        <div className="glass-panel preview-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="folder-illustration">
            <Folder size={64} className="illustration-icon" />
          </div>
          
          <h4 className="preview-heading">Asociación Directa</h4>
          <p className="preview-description" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
            Los productos que asocies aquí cambiarán su categoría de manera inmediata al guardar. Aquellos que desmarques volverán a la categoría genérica "Otros".
          </p>

          <div className="instruction-box glass-panel" style={{ marginTop: '20px' }}>
            <AlertCircle className="instruction-icon" size={20} />
            <div>
              <h5>Sincronización en Cascada</h5>
              <p style={{ fontSize: '0.8rem', color: '#aaa', margin: 0 }}>SQLite mantendrá la integridad relacional de todos los componentes asociados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}