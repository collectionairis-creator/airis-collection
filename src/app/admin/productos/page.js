// src/app/admin/productos/page.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function AdminProductos() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filtro = searchParams.get('filtro') || 'todos';
  const [admin, setAdmin] = useState(null);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const session = localStorage.getItem('adminSession');
    if (!session) {
      router.push('/admin');
      return;
    }
    try {
      const sessionData = JSON.parse(session);
      if (!sessionData.loggedIn) {
        router.push('/admin');
        return;
      }
      setAdmin(sessionData);
    } catch (error) {
      router.push('/admin');
    }
  }, [router]);

  useEffect(() => {
    if (admin) {
      cargarProductos();
    }
  }, [admin]);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const res = await fetch('/api/productos');
      const data = await res.json();
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setProductos([]);
    } finally {
      setCargando(false);
    }
  };

  // 🔥 FILTROS ACTUALIZADOS
  const productosFiltrados = productos.filter((producto) => {
    // Filtros básicos
    if (filtro === 'disponibles' && !producto.disponible) return false;
    if (filtro === 'agotados' && producto.disponible) return false;
    if (filtro === 'destacados' && !producto.destacado) return false;
    
    // 🔥 NUEVOS FILTROS DE INVENTARIO
    if (filtro === 'stockbajo' && !(producto.stock > 0 && producto.stock <= (producto.stock_minimo || 5))) return false;
    if (filtro === 'stocknormal' && !(producto.stock > (producto.stock_minimo || 5) && producto.disponible === 1)) return false;
    if (filtro === 'promocion' && !(producto.en_promocion === 1 && producto.disponible === 1)) return false;
    
    return true;
  });

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    try {
      const res = await fetch(`/api/productos/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMensaje('✅ Producto eliminado correctamente');
        cargarProductos();
        setTimeout(() => setMensaje(''), 3000);
      } else {
        setMensaje('❌ Error al eliminar producto');
      }
    } catch (error) {
      setMensaje('❌ Error al conectar con el servidor');
    }
  };

  const handleToggleDisponible = async (id, disponibleActual) => {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    try {
      const res = await fetch(`/api/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...producto, disponible: disponibleActual ? 0 : 1 }),
      });

      if (res.ok) {
        cargarProductos();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleToggleDestacado = async (id, destacadoActual) => {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    try {
      const res = await fetch(`/api/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...producto, destacado: destacadoActual ? 0 : 1 }),
      });

      if (res.ok) {
        cargarProductos();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 🔥 TÍTULOS DE FILTROS ACTUALIZADOS
  const getTituloFiltro = () => {
    switch(filtro) {
      case 'disponibles': return '✅ Productos Disponibles';
      case 'agotados': return '❌ Productos Agotados';
      case 'destacados': return '⭐ Productos Destacados';
      case 'stockbajo': return '⚠️ Productos con Stock Bajo';
      case 'stocknormal': return '✅ Productos con Stock Normal';
      case 'promocion': return '🏷️ Productos en Promoción';
      default: return '📋 Todos los Productos';
    }
  };

  if (!admin || cargando) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F6F0EA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main style={{
        minHeight: 'calc(100vh - 10rem)',
        backgroundColor: '#F6F0EA',
        padding: '2rem 1.5rem',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {mensaje && (
            <p style={{
              padding: '0.8rem 1rem',
              borderRadius: '12px',
              backgroundColor: mensaje.includes('✅') ? '#E8F5E9' : '#FFEBEE',
              color: mensaje.includes('✅') ? '#2E7D32' : '#C62828',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
            }}>
              {mensaje}
            </p>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <h1 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '2.5rem',
                color: '#111111',
                marginBottom: '0.25rem',
              }}>
                {getTituloFiltro()}
              </h1>
              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.9rem',
                color: '#111111',
                opacity: 0.6,
              }}>
                {productosFiltrados.length} productos encontrados
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href="/admin/productos" style={{
                borderRadius: '9999px',
                backgroundColor: '#E0E0E0',
                padding: '0.6rem 1.2rem',
                border: 'none',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#111111',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C0C0C0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E0E0E0'}>
                📦 Todos
              </a>
              <a href="/admin/productos?filtro=disponibles" style={{
                borderRadius: '9999px',
                backgroundColor: '#4CAF50',
                padding: '0.6rem 1.2rem',
                border: 'none',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#FFFFFF',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#388E3C'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}>
                ✅ Disponibles
              </a>
              <a href="/admin/productos?filtro=agotados" style={{
                borderRadius: '9999px',
                backgroundColor: '#F44336',
                padding: '0.6rem 1.2rem',
                border: 'none',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#FFFFFF',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D32F2F'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F44336'}>
                ❌ Agotados
              </a>
              <a href="/admin/productos?filtro=destacados" style={{
                borderRadius: '9999px',
                backgroundColor: '#C9A45C',
                padding: '0.6rem 1.2rem',
                border: 'none',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#FFFFFF',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B8944A'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C9A45C'}>
                ⭐ Destacados
              </a>
              {/* 🔥 NUEVOS FILTROS */}
              <a href="/admin/productos?filtro=stockbajo" style={{
                borderRadius: '9999px',
                backgroundColor: '#FF9800',
                padding: '0.6rem 1.2rem',
                border: 'none',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#FFFFFF',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F57C00'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF9800'}>
                ⚠️ Stock bajo
              </a>
              <a href="/admin/productos?filtro=stocknormal" style={{
                borderRadius: '9999px',
                backgroundColor: '#2196F3',
                padding: '0.6rem 1.2rem',
                border: 'none',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#FFFFFF',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}>
                ✅ Stock normal
              </a>
              <a href="/admin/productos?filtro=promocion" style={{
                borderRadius: '9999px',
                backgroundColor: '#4CAF50',
                padding: '0.6rem 1.2rem',
                border: 'none',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#FFFFFF',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#388E3C'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}>
                🏷️ Promoción
              </a>
              <a href="/admin/dashboard" style={{
                borderRadius: '9999px',
                backgroundColor: '#E8A6AE',
                padding: '0.6rem 1.2rem',
                border: 'none',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#FFFFFF',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D4959B'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E8A6AE'}>
                ← Volver
              </a>
            </div>
          </div>

          <a href="/admin/productos/nuevo" style={{
            display: 'inline-block',
            marginBottom: '1.5rem',
            borderRadius: '9999px',
            backgroundColor: '#4CAF50',
            padding: '0.6rem 1.5rem',
            border: 'none',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: '#FFFFFF',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#388E3C'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}>
            ➕ Agregar nuevo producto
          </a>

          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.9rem',
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#F6F0EA',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                  }}>
                    <th style={{ padding: '0.8rem 1rem', textAlign: 'left', fontWeight: '600' }}>ID</th>
                    <th style={{ padding: '0.8rem 1rem', textAlign: 'left', fontWeight: '600' }}>Nombre</th>
                    <th style={{ padding: '0.8rem 1rem', textAlign: 'left', fontWeight: '600' }}>Categoría</th>
                    <th style={{ padding: '0.8rem 1rem', textAlign: 'left', fontWeight: '600' }}>Precio</th>
                    <th style={{ padding: '0.8rem 1rem', textAlign: 'center', fontWeight: '600' }}>Stock</th>
                    <th style={{ padding: '0.8rem 1rem', textAlign: 'center', fontWeight: '600' }}>Disponible</th>
                    <th style={{ padding: '0.8rem 1rem', textAlign: 'center', fontWeight: '600' }}>Destacado</th>
                    <th style={{ padding: '0.8rem 1rem', textAlign: 'center', fontWeight: '600' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.length > 0 ? (
                    productosFiltrados.map((producto) => (
                      <tr
                        key={producto.id}
                        style={{
                          borderBottom: '1px solid rgba(0,0,0,0.04)',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FBE4E7'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ padding: '0.8rem 1rem' }}>{producto.id}</td>
                        <td style={{ padding: '0.8rem 1rem', fontWeight: '500' }}>{producto.nombre}</td>
                        <td style={{ padding: '0.8rem 1rem' }}>{producto.categoria}</td>
                        <td style={{ padding: '0.8rem 1rem', fontWeight: '600', color: '#C9A45C' }}>{producto.precio}</td>
                        <td style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>
                          <span style={{
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            color: producto.stock === 0 ? '#F44336' : 
                                   producto.stock <= (producto.stock_minimo || 5) ? '#FF9800' : '#4CAF50',
                          }}>
                            {producto.stock || 0}
                          </span>
                        </td>
                        <td style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>
                          <button
                            onClick={() => handleToggleDisponible(producto.id, producto.disponible)}
                            style={{
                              borderRadius: '9999px',
                              padding: '0.2rem 1rem',
                              border: 'none',
                              backgroundColor: producto.disponible ? '#4CAF50' : '#F44336',
                              color: '#FFFFFF',
                              fontFamily: 'Montserrat, sans-serif',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'opacity 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                          >
                            {producto.disponible ? '✅ Sí' : '❌ No'}
                          </button>
                        </td>
                        <td style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>
                          <button
                            onClick={() => handleToggleDestacado(producto.id, producto.destacado)}
                            style={{
                              borderRadius: '9999px',
                              padding: '0.2rem 1rem',
                              border: 'none',
                              backgroundColor: producto.destacado ? '#C9A45C' : '#E0E0E0',
                              color: producto.destacado ? '#FFFFFF' : '#111111',
                              fontFamily: 'Montserrat, sans-serif',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'opacity 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                          >
                            {producto.destacado ? '⭐ Sí' : 'No'}
                          </button>
                        </td>
                        <td style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>
                          <a
                            href={`/admin/productos/editar/${producto.id}`}
                            style={{
                              display: 'inline-block',
                              borderRadius: '9999px',
                              backgroundColor: '#2196F3',
                              padding: '0.2rem 0.8rem',
                              marginRight: '0.5rem',
                              color: '#FFFFFF',
                              textDecoration: 'none',
                              fontFamily: 'Montserrat, sans-serif',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
                          >
                            ✏️ Editar
                          </a>
                          <button
                            onClick={() => handleEliminar(producto.id)}
                            style={{
                              borderRadius: '9999px',
                              backgroundColor: '#F44336',
                              padding: '0.2rem 0.8rem',
                              border: 'none',
                              color: '#FFFFFF',
                              fontFamily: 'Montserrat, sans-serif',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D32F2F'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F44336'}
                          >
                            🗑️ Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{
                        padding: '3rem 1rem',
                        textAlign: 'center',
                        color: '#111111',
                        opacity: 0.5,
                        fontFamily: 'Montserrat, sans-serif',
                      }}>
                        No hay productos que coincidan con este filtro
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <p style={{
            marginTop: '1rem',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.8rem',
            color: '#111111',
            opacity: 0.4,
            textAlign: 'center',
          }}>
            {productosFiltrados.length} productos en total
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}