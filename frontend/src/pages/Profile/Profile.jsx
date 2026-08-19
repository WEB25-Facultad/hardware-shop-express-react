import React, { useState } from 'react';
import { User, Mail, Shield, Calendar, Key, Check, Save } from 'lucide-react';
import './Profile.css';

export default function Profile() {
  const [isSaved, setIsSaved] = useState(false);
  
  // Estado local para manejar los datos del formulario del perfil
  const [formData, setFormData] = useState({
    name: 'Admin General',
    email: 'admin@ecommerce.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Manejador genérico (Two-Way Data Binding) para actualizar el estado cuando el usuario tipea
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Simulación de guardado (Feedback visual de éxito)
    setIsSaved(true);
    
    setTimeout(() => {
      setIsSaved(false);
      // Limpiamos solo los campos de contraseñas por seguridad después de "guardar"
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    }, 2000);
  };

  // MOCK DATA: Arreglo de datos simulados para maquetar la interfaz de "Sesiones Activas"
  const activeSessions = [
    { device: 'Chrome / Windows 11', location: 'Buenos Aires, AR', ip: '192.168.1.45', status: 'Sesión actual' },
    { device: 'Safari / iPhone 15', location: 'Buenos Aires, AR', ip: '186.22.105.4', status: 'Hace 2 horas' },
    { device: 'Firefox / macOS Sonoma', location: 'Santiago, CL', ip: '200.12.90.11', status: 'Hace 3 días' },
  ];

  return (
    <div className="profile-container">
      <div className="component-placeholder-tag">Componente: Profile</div>

      <header className="page-header animate-fade-in">
        <div>
          <h1 className="text-gradient-purple">Mi Perfil</h1>
          <p className="subtitle">Gestioná tu información personal, contraseña y sesiones activas.</p>
        </div>
      </header>

      <div className="profile-layout">
        {/* Columna Izquierda - Tarjeta de Información Estática */}
        <div className="glass-panel profile-sidebar-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="profile-card-header">
            <div className="profile-avatar-giant">AD</div>
            <h2>{formData.name}</h2>
            <span className="role-tag admin">Administrador</span>
          </div>

          <div className="profile-quick-stats">
            <div className="stat-item">
              <Mail size={16} className="stat-icon" />
              <div>
                <span className="stat-label">Email</span>
                <span className="stat-val">{formData.email}</span>
              </div>
            </div>
            <div className="stat-item">
              <Shield size={16} className="stat-icon" />
              <div>
                <span className="stat-label">Nivel de Acceso</span>
                <span className="stat-val highlight">Control Total</span>
              </div>
            </div>
            <div className="stat-item">
              <Calendar size={16} className="stat-icon" />
              <div>
                <span className="stat-label">Miembro desde</span>
                <span className="stat-val">01/01/2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha - Formulario de Edición y Sesiones */}
        <div className="profile-main-content">
          
          <form onSubmit={handleSave} className="glass-panel profile-form-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="section-title">Información de Cuenta</h3>
            
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="name">Nombre Completo</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <h3 className="section-title divider-top">Seguridad y Contraseña</h3>
            
            <div className="form-group">
              <label htmlFor="currentPassword">Contraseña Actual</label>
              <input 
                type="password" 
                id="currentPassword" 
                name="currentPassword" 
                value={formData.currentPassword} 
                onChange={handleChange} 
                placeholder="••••••••" 
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="newPassword">Nueva Contraseña</label>
                <input 
                  type="password" 
                  id="newPassword" 
                  name="newPassword" 
                  value={formData.newPassword} 
                  onChange={handleChange} 
                  placeholder="Min. 8 caracteres" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  placeholder="Repetí la contraseña" 
                />
              </div>
            </div>

            <div className="form-actions">
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

          {/* Panel de Sesiones Activas iterando sobre el Mock Data */}
          <div className="glass-panel profile-sessions-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="section-title">Sesiones Activas</h3>
            <div className="sessions-list">
              {activeSessions.map((session, idx) => (
                <div key={idx} className="session-item">
                  <div className="session-status-dot"></div>
                  <div className="session-info">
                    <span className="session-device">{session.device}</span>
                    <span className="session-meta">IP: {session.ip} • {session.location}</span>
                  </div>
                  {/* Agregamos una clase especial ('active') solo al primer elemento (Sesión Actual) */}
                  <span className={`session-badge ${idx === 0 ? 'active' : ''}`}>
                    {session.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
