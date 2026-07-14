import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './UserView.css';
import { ArrowLeft, Save, Mail, Calendar, Key, Check } from 'lucide-react';

export default function UserView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  const mockUsers = [
    { id: 1, name: 'Alvaro Silvera', email: 'alvaro@ecommerce.com', role: 'Administrador', status: 'Activo', initials: 'AS', joined: '12/01/2026' },
    { id: 2, name: 'Jona Oliva', email: 'jona@ecommerce.com', role: 'Editor', status: 'Activo', initials: 'JO', joined: '15/01/2026' },
    { id: 3, name: 'Luka Mercado', email: 'luka@ecommerce.com', role: 'Administrador', status: 'Activo', initials: 'LM', joined: '10/02/2026' },
    { id: 4, name: 'Sofía Rossi', email: 'sofia.rossi@gmail.com', role: 'Cliente', status: 'Inactivo', initials: 'SR', joined: '04/03/2026' },
    { id: 5, name: 'Martin Fierro', email: 'martin.fierro@outlook.com', role: 'Cliente', status: 'Activo', initials: 'MF', joined: '22/03/2026' },
  ];

  const userData = mockUsers.find(u => u.id === parseInt(id)) || {
    id: 'Nuevo',
    name: '',
    email: '',
    role: 'Cliente',
    status: 'Activo',
    initials: '?',
    joined: 'Hoy',
  };

  const [formData, setFormData] = useState(userData);

  useEffect(() => {
    if (id) {
      const found = mockUsers.find(u => u.id === parseInt(id));
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
      navigate('/users');
    }, 1500);
  };

  const recentActivity = [
    { action: 'Inicio de sesión', ip: '192.168.1.45', date: 'Hoy, 10:14' },
    { action: 'Cambio de contraseña', ip: '192.168.1.45', date: 'Ayer, 18:30' },
    { action: 'Compra registrada (#1024)', ip: '186.22.105.4', date: '12/06/2026' },
  ];

  return (
    <div className="user-view-container">
      {/* Component Name Placeholder (Styled) */}
      <div className="component-placeholder-tag">Component: UserView</div>

      <header className="page-header animate-fade-in">
        <div className="back-link-wrapper">
          <Link to="/users" className="back-link">
            <ArrowLeft size={16} /> Volver a Usuarios
          </Link>
          <div className="title-section">
            <h1 className="text-gradient-cyan">Ficha de Usuario</h1>
            <p className="subtitle">Configurá los permisos, roles e información de contacto del perfil.</p>
          </div>
        </div>
      </header>

      <div className="user-view-layout">
        {/* Profile Card & Bio */}
        <div className="glass-panel profile-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="profile-header-info">
            <div className="profile-avatar-large">
              {formData.initials}
            </div>
            <h2>{formData.name}</h2>
            <span className={`role-tag ${
              formData.role === 'Administrador' ? 'admin' :
              formData.role === 'Editor' ? 'editor' : 'client'
            }`}>
              {formData.role}
            </span>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <Mail size={16} className="detail-icon" />
              <div>
                <span className="detail-label">Correo Electrónico</span>
                <span className="detail-val">{formData.email}</span>
              </div>
            </div>

            <div className="detail-item">
              <Calendar size={16} className="detail-icon" />
              <div>
                <span className="detail-label">Miembro desde</span>
                <span className="detail-val">{formData.joined}</span>
              </div>
            </div>

            <div className="detail-item">
              <Key size={16} className="detail-icon" />
              <div>
                <span className="detail-label">Estado de Cuenta</span>
                <span className="detail-val highlight">{formData.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form & Activity */}
        <div className="form-activity-wrapper">
          {/* Edit Form */}
          <form onSubmit={handleSave} className="glass-panel user-form animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="section-title">Permisos y Rol</h3>
            
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="role">Rol del Sistema</label>
                <select 
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="Administrador">Administrador (Acceso Total)</option>
                  <option value="Editor">Editor (Acceso de Escritura Limitado)</option>
                  <option value="Cliente">Cliente (Acceso Tienda)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Estado del Usuario</label>
                <select 
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Activo">Activo (Habilitado)</option>
                  <option value="Inactivo">Inactivo (Suspendido)</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate('/users')} className="cancel-btn">
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

          {/* Activity Log */}
          <div className="glass-panel activity-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="section-title">Registro de Actividad</h3>
            <div className="activity-list">
              {recentActivity.map((act, idx) => (
                <div key={idx} className="activity-item">
                  <div className="activity-bullet"></div>
                  <div className="activity-desc">
                    <span className="activity-action">{act.action}</span>
                    <span className="activity-meta">IP: {act.ip} • {act.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
