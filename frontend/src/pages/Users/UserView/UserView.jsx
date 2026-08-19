import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './UserView.css';
import { ArrowLeft, Save, Mail, Calendar, Key, Check, ShieldAlert } from 'lucide-react';

export default function UserView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isNew = !id || id === 'new';

  // Estado del formulario de usuario
  const [formData, setFormData] = useState({
    id: isNew ? 'Nuevo' : id,
    name: '',
    email: '',
    role: 'Cliente',
    status: 'Activo',
    initials: '?',
    joined: 'Hoy',
    password: '',
  });

  // Cargamos los datos si se trata de una edición de usuario existente
  useEffect(() => {
    if (id && id !== 'new') {
      setIsLoading(true);
      fetch(`http://localhost:3000/api/users/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Error al obtener el usuario');
          return res.json();
        })
        .then(data => {
          setFormData({
            ...data,
            // Medida de seguridad Front-End: Aseguramos que el campo password quede vacío al editar
            password: '' // No se carga la contraseña por razones de seguridad
          });
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching user detail:', err);
          setIsLoading(false);
        });
    } else {
      // Valores por defecto para la creación de un nuevo usuario
      setFormData({
        id: 'Nuevo',
        name: '',
        email: '',
        role: 'Cliente',
        status: 'Activo',
        initials: 'NU',
        joined: 'Hoy',
        password: '',
      });
      setIsLoading(false);
    }
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-generamos las iniciales para el avatar en base al nombre
      if (name === 'name' && isNew) {
        updated.initials = value
          ? value.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2)
          : 'NU';
      }
      return updated;
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Validaciones estrictas si se está registrando un nuevo usuario
    if (isNew) {
      if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
        alert('Por favor, completa los campos obligatorios: Nombre, Email y Contraseña');
        return;
      }
      if (formData.password.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres para ser segura');
        return;
      }
    }

    const url = isNew ? 'http://localhost:3000/api/users' : `http://localhost:3000/api/users/${id}`;
    const method = isNew ? 'POST' : 'PUT';
    
    // Diferenciación de Payload: Enviamos datos sensibles solo si estamos creando
    // Si es creación enviamos los datos completos del registro; si es edición, solo el rol y estado
    const bodyData = isNew 
      ? {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
          status: formData.status
        }
      : {
          role: formData.role,
          status: formData.status
        };

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.error || 'Error al guardar los cambios') });
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setIsSaved(true);
          setTimeout(() => {
            setIsSaved(false);
            navigate('/users');
          }, 1500);
        } else {
          alert(data.error || 'Error al guardar los cambios');
        }
      })
      .catch(err => {
        console.error('Error saving user:', err);
        alert(err.message);
      });
  };

  // Simulación de actividad del usuario
  const recentActivity = [
    { action: 'Registro de cuenta', ip: '127.0.0.1 (Servidor)', date: 'Hoy, Reciente' }
  ];

  if (isLoading && !isNew) {
    return (
      <div className="user-view-container">
        <div className="component-placeholder-tag">Component: UserView</div>
        <div className="loading-state" style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>
          Cargando datos del usuario...
        </div>
      </div>
    );
  }

  return (
    <div className="user-view-container">
      <div className="component-placeholder-tag">Component: UserView</div>

      <header className="page-header animate-fade-in">
        <div className="back-link-wrapper">
          <Link to="/users" className="back-link">
            <ArrowLeft size={16} /> Volver a Usuarios
          </Link>
          <div className="title-section">
            <h1 className="text-gradient-cyan">
              {isNew ? 'Registrar Usuario' : 'Ficha de Usuario'}
            </h1>
            <p className="subtitle">Configurá las credenciales, roles y permisos de acceso al Dashboard.</p>
          </div>
        </div>
      </header>

      <div className="user-view-layout">
        {/* Tarjeta de perfil y resumen del usuario */}
        <div className="glass-panel profile-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="profile-header-info">
            <div className="profile-avatar-large">
              {formData.initials || 'NU'}
            </div>
            <h2>{formData.name || 'Nuevo Usuario'}</h2>
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
                <span className="detail-val">{formData.email || 'correo@ejemplo.com'}</span>
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

        {/* Sección de Formulario y Actividad */}
        <div className="form-activity-wrapper">
          <form onSubmit={handleSave} className="glass-panel user-form animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="section-title">Datos Personales y Rol</h3>
            
            {/* NUEVO: Campos para registrar un nuevo usuario desde el Dashboard */}
            {isNew && (
              <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label htmlFor="name">Nombre Completo</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Ej. Juan Pérez"
                    required 
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label htmlFor="email">Correo Electrónico</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="correo@ejemplo.com"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Contraseña de Acceso</label>
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    placeholder="Min. 8 caracteres"
                    required 
                  />
                </div>
              </div>
            )}

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

          {/* Historial de actividad (Solo para usuarios existentes) */}
          {!isNew && (
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
          )}
        </div>
      </div>
    </div>
  );
}
