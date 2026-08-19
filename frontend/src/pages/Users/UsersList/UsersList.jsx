import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UsersList.css';
import { Search, Eye, Edit3, Trash2, ShieldCheck, UserCheck, UserX } from 'lucide-react';

export default function UsersList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hook de Efecto: Carga la lista inicial de usuarios desde la Base de Datos
  useEffect(() => {
    fetch('http://localhost:3000/api/users')
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener usuarios');
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setIsLoading(false);
      });
  }, []);

  const handleDelete = (id, name) => {
    // Interacción nativa del navegador para prevenir borrados accidentales
    if (window.confirm(`¿Estás seguro de que querés eliminar al usuario ${name}?`)) {
      fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'DELETE'
      })
        .then(res => {
          if (!res.ok) throw new Error('Error al eliminar usuario');
          return res.json();
        })
        .then(data => {
          if (data.success) {
            // Actualización optimista de la UI: Filtramos el usuario borrado del estado local
            setUsers(prev => prev.filter(u => u.id !== id));
          } else {
            alert(data.error || 'Error al eliminar usuario');
          }
        })
        .catch(err => {
          console.error('Error deleting user:', err);
          alert('Ocurrió un error al intentar eliminar el usuario');
        });
    }
  };

  // Filtrado reactivo en tiempo real (Client-Side Search)
  const filteredUsers = users.filter(u =>
    (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.role && u.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="users-list-container">
      <div className="component-placeholder-tag">Componente: UsersList</div>

      <header className="page-header animate-fade-in">
        <div>
          <h1 className="text-gradient-cyan">Control de Usuarios</h1>
          <p className="subtitle">Administrá las cuentas de tus clientes y los permisos del personal administrativo.</p>
        </div>
        {/* NUEVO: Botón para navegar a la pantalla de registro de nuevo usuario */}
        <Link to="/users/new" className="glow-btn add-user-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCheck size={18} /> Registrar Usuario
        </Link>
      </header>

      {/* Barra de Búsqueda conectada al estado searchTerm */}
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

      {/* Tabla de Usuarios */}
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
                      {/* Renderizado condicional dinámico para estilos CSS (Badge) */}
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
                      <button onClick={() => handleDelete(u.id, u.name)} className="action-btn delete" title="Eliminar Usuario">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-table-cell">
                    {isLoading ? 'Cargando usuarios...' : 'No se encontraron usuarios que coincidan con la búsqueda.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span className="pagination-info">Mostrando {filteredUsers.length} de {users.length} usuarios</span>
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
