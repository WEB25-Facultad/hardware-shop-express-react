import React, { useState } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { Store, LayoutDashboard, ShoppingBag, FolderOpen, Users, Bell, Menu, X, ChevronRight } from 'lucide-react';
import './AppLayout.css';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Helper to generate dynamic breadcrumbs based on the current pathname
  const renderBreadcrumb = () => {
    const path = location.pathname;
    const items = [{ label: 'Inicio', link: '/' }];

    if (path === '/products') {
      items.push({ label: 'Productos', link: '/products' });
    } else if (path === '/products/new') {
      items.push({ label: 'Productos', link: '/products' });
      items.push({ label: 'Nuevo Producto', link: '/products/new' });
    } else if (path.startsWith('/products/')) {
      const id = path.split('/')[2];
      items.push({ label: 'Productos', link: '/products' });
      items.push({ label: `Detalle #${id}`, link: path });
    } else if (path === '/categories') {
      items.push({ label: 'Categorías', link: '/categories' });
    } else if (path === '/categories/new') {
      items.push({ label: 'Categorías', link: '/categories' });
      items.push({ label: 'Nueva Categoría', link: '/categories/new' });
    } else if (path.startsWith('/categories/')) {
      const id = path.split('/')[2];
      items.push({ label: 'Categorías', link: '/categories' });
      items.push({ label: `Detalle #${id}`, link: path });
    } else if (path === '/users') {
      items.push({ label: 'Usuarios', link: '/users' });
    } else if (path === '/users/new') {
      items.push({ label: 'Usuarios', link: '/users' });
      items.push({ label: 'Nuevo Usuario', link: '/users/new' });
    } else if (path.startsWith('/users/')) {
      const id = path.split('/')[2];
      items.push({ label: 'Usuarios', link: '/users' });
      items.push({ label: `Ficha #${id}`, link: path });
    } else if (path === '/profile') {
      items.push({ label: 'Mi Perfil', link: '/profile' });
    } else if (path !== '/') {
      items.push({ label: 'Error 404', link: path });
    }

    return (
      <div className="breadcrumb-wrapper">
        {items.map((item, index) => (
          <React.Fragment key={item.link}>
            {index > 0 && <ChevronRight size={14} className="breadcrumb-separator" />}
            {index === items.length - 1 ? (
              <span className="breadcrumb-item active">{item.label}</span>
            ) : (
              <Link to={item.link} className="breadcrumb-item-link">{item.label}</Link>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="layout-container">
      {/* Background overlay for mobile drawer */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar Container */}
      <aside className={`sidebar-container glass-panel ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Store className="logo-icon" size={26} />
            <span className="logo-text text-gradient-rainbow">Mi E-Commerce</span>
          </div>
          {/* Close button for mobile screen widths */}
          <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)} title="Cerrar menú">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end
            onClick={() => setIsSidebarOpen(false)}
          >
            <LayoutDashboard size={20} />
            <span>General</span>
          </NavLink>

          <NavLink 
            to="/products" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <ShoppingBag size={20} />
            <span>Productos</span>
          </NavLink>

          <NavLink 
            to="/categories" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <FolderOpen size={20} />
            <span>Categorías</span>
          </NavLink>

          <NavLink 
            to="/users" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Users size={20} />
            <span>Usuarios</span>
          </NavLink>
        </nav>

        {/* User profile details at the bottom */}
        <div className="sidebar-footer">
          <Link to="/profile" className="sidebar-user-profile" onClick={() => setIsSidebarOpen(false)}>
            <div className="user-avatar">AD</div>
            <div className="user-info">
              <span className="user-name">Admin General</span>
              <span className="user-role">Administrador</span>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <div className="main-area">
        {/* Top Header / Navbar */}
        <header className="main-header glass-panel">
          <div className="header-left">
            <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)} title="Abrir menú">
              <Menu size={24} />
            </button>
            {/* Dynamic Breadcrumbs */}
            {renderBreadcrumb()}
          </div>

          <div className="header-right">
            <button className="navbar-icon-btn" title="Notificaciones">
              <Bell size={20} />
              <span className="dot-indicator"></span>
            </button>
            
            <div className="navbar-divider"></div>
            
            <Link to="/profile" className="user-profile-link">
              <div className="user-profile">
                <div className="user-avatar">AD</div>
                <div className="user-info">
                  <span className="user-role">Admin</span>
                </div>
              </div>
            </Link>
          </div>
        </header>

        {/* Main Content Area (Vertically Scrollable) */}
        <div className="main-content-wrapper">
          <main className="content-container">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
