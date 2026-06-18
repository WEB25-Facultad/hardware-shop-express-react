import React from 'react';
import './Home.css';
import { TrendingUp, Users, ShoppingBag, FolderOpen, ArrowUpRight, Award, Clock } from 'lucide-react';

export default function Home() {
  const metrics = [
    { title: 'Ventas Totales', value: '$1,234,567', change: '+12.5%', icon: <TrendingUp className="metric-icon purple" />, positive: true },
    { title: 'Usuarios Activos', value: '1,482', change: '+8.3%', icon: <Users className="metric-icon cyan" />, positive: true },
    { title: 'Productos', value: '342', change: '+2.4%', icon: <ShoppingBag className="metric-icon pink" />, positive: true },
    { title: 'Categorías', value: '12', change: '0%', icon: <FolderOpen className="metric-icon yellow" />, positive: false },
  ];

  const recentOrders = [
    { id: '#1024', user: 'Ana Martínez', total: '$4,200', status: 'Completado', time: 'hace 5 min' },
    { id: '#1023', user: 'Carlos Pérez', total: '$12,500', status: 'Pendiente', time: 'hace 15 min' },
    { id: '#1022', user: 'María López', total: '$8,900', status: 'Completado', time: 'hace 1 hora' },
    { id: '#1021', user: 'Juan Gómez', total: '$3,150', status: 'Cancelado', time: 'hace 3 horas' },
  ];

  return (
    <div className="home-container">
      {/* Component Name Placeholder (Styled) */}
      <div className="component-placeholder-tag">Component: Home</div>

      <header className="page-header animate-fade-in">
        <div>
          <h1 className="text-gradient-rainbow">Panel General</h1>
          <p className="subtitle">Bienvenido de nuevo, Administrador. Aquí está el resumen de hoy.</p>
        </div>
      </header>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {metrics.map((m, idx) => (
          <div key={idx} className="metric-card glass-panel animate-scale-up" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="metric-header">
              <span className="metric-title">{m.title}</span>
              {m.icon}
            </div>
            <div className="metric-body">
              <span className="metric-value">{m.value}</span>
              <span className={`metric-change ${m.positive ? 'positive' : 'neutral'}`}>
                {m.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Orders & Activity */}
      <div className="dashboard-layout">
        {/* Recent Orders */}
        <div className="glass-panel layout-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="card-header">
            <h3>Pedidos Recientes</h3>
            <button className="view-all-btn">Ver todos <ArrowUpRight size={16} /></button>
          </div>
          <div className="table-responsive">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Tiempo</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">{order.id}</td>
                    <td>{order.user}</td>
                    <td className="order-total">{order.total}</td>
                    <td>
                      <span className={`badge ${
                        order.status === 'Completado' ? 'badge-success' :
                        order.status === 'Pendiente' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="order-time"><Clock size={12} /> {order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity / Performance */}
        <div className="glass-panel layout-card animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="card-header">
            <h3>Rendimiento del Sistema</h3>
          </div>
          <div className="performance-content">
            <div className="performance-item">
              <div className="perf-label">
                <span>Carga del Servidor</span>
                <span className="perf-val">34%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill purple" style={{ width: '34%' }}></div>
              </div>
            </div>

            <div className="performance-item">
              <div className="perf-label">
                <span>Tiempo de Respuesta API</span>
                <span className="perf-val">120ms</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill cyan" style={{ width: '12%' }}></div>
              </div>
            </div>

            <div className="performance-item">
              <div className="perf-label">
                <span>Uso de Base de Datos</span>
                <span className="perf-val">68%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill pink" style={{ width: '68%' }}></div>
              </div>
            </div>

            <div className="quick-tip glass-panel">
              <Award className="tip-icon" size={24} />
              <div>
                <h4>Consejo de Optimización</h4>
                <p>Todos los sistemas están funcionando óptimamente. Las consultas de categorías se han indexado en caché.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
