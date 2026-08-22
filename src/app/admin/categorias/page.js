// src/app/admin/categorias/page.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function AdminCategorias() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [nuevaSubcategoria, setNuevaSubcategoria] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);

  // Orden personalizado de categorías
  const ordenCategorias = ['Bath & Body Works', "Victoria's Secret", 'Cuidado Personal', 'Moda', 'Accesorios', 'Perfumería'];

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
      cargarCategorias();
    }
  }, [admin]);

  const cargarCategorias = async () => {
    try {
      setCargando(true);
      const res = await fetch('/api/categorias');
      const data = await res.json();
      
      // Mapear para incluir IDs de subcategorías
      const dataConIds = data.map(cat => ({
        ...cat,
        subcategorias_ids: cat.subcategorias_ids || []
      }));
      
      // Ordenar
      const dataOrdenada = dataConIds.sort((a, b) => {
        return ordenCategorias.indexOf(a.nombre) - ordenCategorias.indexOf(b.nombre);
      });
      setCategorias(dataOrdenada);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleAgregarCategoria = async () => {
    if (!nuevaCategoria.trim()) {
      setMensaje('❌ Escribe un nombre para la categoría');
      return;
    }

    try {
      const res = await fetch('/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevaCategoria.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje(`✅ Categoría "${nuevaCategoria}" agregada`);
        setNuevaCategoria('');
        cargarCategorias();
        setTimeout(() => setMensaje(''), 3000);
      } else {
        setMensaje('❌ ' + data.error);
      }
    } catch (error) {
      setMensaje('❌ Error al conectar con el servidor');
    }
  };

  const handleEliminarCategoria = async (id, nombre) => {
    if (!confirm(`¿Eliminar la categoría "${nombre}" y todas sus subcategorías?`)) return;

    try {
      const res = await fetch('/api/categorias', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setMensaje(`✅ Categoría "${nombre}" eliminada`);
        cargarCategorias();
        setTimeout(() => setMensaje(''), 3000);
      } else {
        const data = await res.json();
        setMensaje('❌ ' + data.error);
      }
    } catch (error) {
      setMensaje('❌ Error al conectar con el servidor');
    }
  };

  const handleAgregarSubcategoria = async () => {
    if (!nuevaSubcategoria.trim()) {
      setMensaje('❌ Escribe un nombre para la subcategoría');
      return;
    }
    if (!categoriaSeleccionada) {
      setMensaje('❌ Selecciona una categoría');
      return;
    }

    try {
      const res = await fetch('/api/subcategorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nuevaSubcategoria.trim(),
          categoria_id: parseInt(categoriaSeleccionada),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje(`✅ Subcategoría "${nuevaSubcategoria}" agregada`);
        setNuevaSubcategoria('');
        cargarCategorias();
        setTimeout(() => setMensaje(''), 3000);
      } else {
        setMensaje('❌ ' + data.error);
      }
    } catch (error) {
      setMensaje('❌ Error al conectar con el servidor');
    }
  };

  const handleEliminarSubcategoria = async (id, nombre) => {
    if (!confirm(`¿Eliminar la subcategoría "${nombre}"?`)) return;

    try {
      const res = await fetch('/api/subcategorias', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setMensaje(`✅ Subcategoría "${nombre}" eliminada`);
        cargarCategorias();
        setTimeout(() => setMensaje(''), 3000);
      } else {
        const data = await res.json();
        setMensaje('❌ ' + data.error);
      }
    } catch (error) {
      setMensaje('❌ Error al conectar con el servidor');
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
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '2.5rem',
              color: '#111111',
            }}>
              📂 Gestionar Categorías
            </h1>
            <a
              href="/admin/dashboard"
              style={{
                borderRadius: '9999px',
                backgroundColor: '#E8A6AE',
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
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D4959B'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E8A6AE'}
            >
              ← Volver
            </a>
          </div>

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

          {/* Agregar categoría */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <h3 style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '0.75rem',
            }}>
              ➕ Agregar nueva categoría
            </h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(e.target.value)}
                placeholder="Nombre de la categoría"
                style={{
                  flex: 1,
                  padding: '0.7rem 1rem',
                  borderRadius: '12px',
                  border: '2px solid #E8A6AE',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.9rem',
                  color: '#111111',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleAgregarCategoria}
                style={{
                  borderRadius: '9999px',
                  backgroundColor: '#4CAF50',
                  padding: '0.7rem 1.5rem',
                  border: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#388E3C'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
              >
                Agregar
              </button>
            </div>
          </div>

          {/* Agregar subcategoría */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <h3 style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '0.75rem',
            }}>
              ➕ Agregar subcategoría
            </h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <select
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '150px',
                  padding: '0.7rem 1rem',
                  borderRadius: '12px',
                  border: '2px solid #E8A6AE',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.9rem',
                  color: '#111111',
                  outline: 'none',
                }}
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
              <input
                type="text"
                value={nuevaSubcategoria}
                onChange={(e) => setNuevaSubcategoria(e.target.value)}
                placeholder="Nombre de la subcategoría"
                style={{
                  flex: 1,
                  minWidth: '150px',
                  padding: '0.7rem 1rem',
                  borderRadius: '12px',
                  border: '2px solid #E8A6AE',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.9rem',
                  color: '#111111',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleAgregarSubcategoria}
                style={{
                  borderRadius: '9999px',
                  backgroundColor: '#2196F3',
                  padding: '0.7rem 1.5rem',
                  border: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
              >
                Agregar
              </button>
            </div>
          </div>

          {/* Lista de categorías y subcategorías */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <h3 style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '0.75rem',
            }}>
              📋 Categorías y subcategorías
            </h3>

            {categorias.length === 0 ? (
              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.9rem',
                color: '#111111',
                opacity: 0.5,
                textAlign: 'center',
                padding: '1rem 0',
              }}>
                No hay categorías creadas
              </p>
            ) : (
              categorias.map((categoria) => (
                <div
                  key={categoria.id}
                  style={{
                    borderBottom: '1px solid rgba(0,0,0,0.04)',
                    padding: '0.75rem 0',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <span style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#111111',
                    }}>
                      {categoria.nombre}
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '400',
                        opacity: 0.4,
                        marginLeft: '0.5rem',
                      }}>
                        ({categoria.subcategorias?.length || 0} subcategorías)
                      </span>
                    </span>
                    <button
                      onClick={() => handleEliminarCategoria(categoria.id, categoria.nombre)}
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
                      Eliminar
                    </button>
                  </div>
                  {categoria.subcategorias && categoria.subcategorias.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.3rem',
                      marginTop: '0.3rem',
                      paddingLeft: '0.5rem',
                    }}>
                      {categoria.subcategorias.map((sub, index) => {
                        // Obtener el ID de la subcategoría
                        const subId = categoria.subcategorias_ids?.[index] || index;
                        return (
                          <span
                            key={index}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              backgroundColor: '#FBE4E7',
                              borderRadius: '9999px',
                              padding: '0.15rem 0.6rem',
                              fontFamily: 'Montserrat, sans-serif',
                              fontSize: '0.75rem',
                              color: '#111111',
                            }}
                          >
                            {sub}
                            <button
                              onClick={() => handleEliminarSubcategoria(subId, sub)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.7rem',
                                opacity: 0.4,
                                padding: '0 0.1rem',
                              }}
                            >
                              ✕
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}