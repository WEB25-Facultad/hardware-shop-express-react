import React from 'react';
import { Link } from 'react-router-dom';
import './CategoriesList.css';
import { Plus, Eye, Edit3, Trash2, Smartphone, Volume2, Shirt, Keyboard, Home } from 'lucide-react';

export default function CategoriesList() {
  // Estado local: Guarda la lista de categorías y el estado de carga (loading)
  const [categories, setCategories] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Hook de ciclo de vida: Se ejecuta una sola vez cuando el componente se monta en pantalla
  React.useEffect(() => {
    fetchCategories();
  }, []);

  // Consumo de la API REST (GET) utilizando la API Fetch nativa del navegador
  const fetchCategories = () => {
    fetch('http://localhost:3000/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setIsLoading(false); // Apagamos el indicador de carga al recibir los datos
      })
      .catch(err => {
        console.error('Error al obtener categorías:', err);
        setIsLoading(false);
      });
  };

  // Acción de borrado consumiendo la API REST (DELETE)
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      fetch(`http://localhost:3000/api/categories/${id}`, { method: 'DELETE' })
        .then(res => {
          if (!res.ok) throw new Error('Error al eliminar');
          return res.json();
        })
        .then(() => {
          // Refrescamos la lista volviendo a llamar a la API tras un borrado exitoso
          fetchCategories();
        })
        .catch(err => alert(err.message));
    }
  };

  return (
    <div className="categories-list-container">
      {/* Etiqueta visual para identificar el componente (Sólo UI) */}
      <div className="component-placeholder-tag">Componente: CategoriesList</div>

      <header className="page-header animate-fade-in">
        <div>
          <h1 className="text-gradient-purple">Módulo de Categorías</h1>
          <p className="subtitle">Administrá las divisiones lógicas de tus productos para facilitar la navegación en la tienda.</p>
        </div>
        {/* Navegación mediante React Router sin recargar la página */}
        <Link to="/categories/new" className="glow-btn add-category-btn">
          <Plus size={18} /> Crear Categoría
        </Link>
      </header>

      <div className="categories-grid animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {/* Renderizado condicional: Muestra texto si está cargando, o las tarjetas si ya hay datos */}
        {isLoading ? (
          <p>Cargando categorías...</p>
        ) : (
          categories.map((c, idx) => (
            // Uso de la prop "key" (Obligatoria en React al mapear arrays) para optimizar el Virtual DOM
            <div key={c.id} className="category-card glass-panel animate-scale-up" style={{ animationDelay: `${idx * 0.08}s` }}>
              <div className="category-card-header">
                <div className="category-icon-wrapper">
                  <Smartphone size={24} />
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
                {/* Evento onClick para detonar la función handleDelete */}
                <button onClick={() => handleDelete(c.id)} className="footer-action-btn delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}