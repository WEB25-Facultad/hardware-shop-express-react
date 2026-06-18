import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './UsersList.css';
import { Search, Eye, Edit3, Trash2, ShieldCheck, UserCheck, UserX } from 'lucide-react';

export default function UsersList() {
  const [searchTerm, setSearchTerm] = useState('');

  const mockUsers = [
    { id: 1, name: 'Alvaro Silvera', email: 'alvaro@ecommerce.com', role: 'Administrador', status: 'Activo', initials: 'AS' },
    { id: 2, name: 'Jona Oliva', email: 'jona@ecommerce.com', role: 'Editor', status: 'Activo', initials: 'JO' },
    { id: 3, name: 'Luka Mercado', email: 'luka@ecommerce.com', role: 'Administrador', status: 'Activo', initials: 'LM' },
    { id: 4, name: 'Sofía Rossi', email: 'sofia.rossi@gmail.com', role: 'Cliente', status: 'Inactivo', initials: 'SR' },
    { id: 5, name: 'Martin Fierro', email: 'martin.fierro@outlook.com', role: 'Cliente', status: 'Activo', initials: 'MF' },
  ];

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="users-list-container">
      {/* Component Name Placeholder (Styled) */}
      <div className="component-placeholder-tag">Component: UsersList</div>

      <header className="page-header animate-fade-in">
        <div>
          <h1 className="text-gradient-cyan">Control de Usuarios</h1>
          <p className="subtitle">Administrá las cuentas de tus clientes y los permisos del personal administrativo.</p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="table-controls animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="search-bar-wrapper">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, email o rol..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel table-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="table-responsive">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="user-id">#{u.id}</td>
                    <td className="user-profile-cell">
                      <div className="user-avatar-circle">
                        {u.initials}
                      </div>
                      <span className="user-name">{u.name}</span>
                    </td>
                    <td className="user-email">{u.email}</td>
                    <td>
                      <span className={`role-tag ${
                        u.role === 'Administrador' ? 'admin' :
                        u.role === 'Editor' ? 'editor' : 'client'
                      }`}>
                        {u.role === 'Administrador' && <ShieldCheck size={12} />}
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        u.status === 'Activo' ? 'badge-success' : 'badge-danger'
                      }`}>
                        {u.status === 'Activo' ? <UserCheck size={12} style={{marginRight: 4}} /> : <UserX size={12} style={{marginRight: 4}} />}
                        {u.status}
                      </span>
                    </td>
                    <td className="table-actions text-right">
                      <Link to={`/users/${u.id}`} className="action-btn view" title="Ver Ficha">
                        <Eye size={16} />
                      </Link>
                      <Link to={`/users/${u.id}`} className="action-btn edit" title="Editar Permisos">
                        <Edit3 size={16} />
                      </Link>
                      <button className="action-btn delete" title="Suspender Cuenta">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-table-cell">
                    No se encontraron usuarios que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span className="pagination-info">Mostrando {filteredUsers.length} de {mockUsers.length} usuarios</span>
          <div className="pagination-controls">
            <button className="pagination-btn" disabled>Anterior</button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn" disabled>Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
}
