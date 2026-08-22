// src/app/catalogo/page.js
"use client";

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';

export default function Catalogo() {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaPrincipal, setCategoriaPrincipal] = useState('todos');
  const [subcategoria, setSubcategoria] = useState('todos');
  const [paginaActual, setPaginaActual] = useState(1);
  const [productosPorPagina, setProductosPorPagina] = useState(12);
  const [productos, setProductos] = useState([]);
  const [categoriasDB, setCategoriasDB] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroPromocion, setFiltroPromocion] = useState('todos');

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true);
        const res = await fetch('/api/productos');
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const data = await res.json();
        setProductos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setProductos([]);
      } finally {
        setCargando(false);
      }
    };
    cargarProductos();
  }, []);

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const res = await fetch('/api/categorias');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const orden = ['Bath & Body Works', "Victoria's Secret", 'Cuidado Personal', 'Moda', 'Accesorios', 'Perfumería'];
            const dataOrdenada = data.sort((a, b) => {
              return orden.indexOf(a.nombre) - orden.indexOf(b.nombre);
            });
            setCategoriasDB(dataOrdenada);
          }
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    cargarCategorias();
  }, []);

  const productosArray = Array.isArray(productos) ? productos : [];
  const hayPromociones = productosArray.some(p => p.en_promocion === 1 && p.disponible === 1);

  const categoriasUnicas = ['todos', ...categoriasDB.map(c => c.nombre)];

  const productosFiltrados = productosArray.filter((producto) => {
    if (!producto || !producto.disponible) return false;
    
    const coincideBusqueda = producto.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
                            producto.marca?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaPrincipal === 'todos' || producto.categoria === categoriaPrincipal;
    const coincideSubcategoria = subcategoria === 'todos' || producto.subcategoria === subcategoria;
    const coincidePromocion = filtroPromocion === 'todos' || 
                              (filtroPromocion === 'promocion' && producto.en_promocion === 1);
    
    return coincideBusqueda && coincideCategoria && coincideSubcategoria && coincidePromocion;
  });

  const totalProductos = productosFiltrados.length;
  const totalPaginas = Math.ceil(totalProductos / productosPorPagina) || 1;
  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPaginados = productosFiltrados.slice(inicio, fin);

  const subcategoriasPorCategoria = {
    'Bath & Body Works': ["Men's Shop", 'Set de regalos', 'Splash', 'Cremas', 'Hogar y Velas', 'Jabones y antibacteriales'],
    "Victoria's Secret": ['Splash', 'Cremas', 'Pantys'],
    'Perfumería': ['Perfumes para dama', 'Perfumes para caballero'],
    'Moda': ['Dama', 'Caballero'],
    'Cuidado Personal': ['Cremas', 'Exfoliantes', 'Limpieza corporal'],
    'Accesorios': [],
  };

  const subcategoriasActuales = categoriaPrincipal !== 'todos' ? subcategoriasPorCategoria[categoriaPrincipal] || [] : [];

  const irAPagina = (pagina) => {
    if (pagina < 1 || pagina > totalPaginas) return;
    setPaginaActual(pagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cambiarProductosPorPagina = (cantidad) => {
    setProductosPorPagina(cantidad);
    setPaginaActual(1);
  };

  const handleCategoriaClick = (categoria) => {
    if (categoriaPrincipal === categoria) {
      setCategoriaPrincipal('todos');
      setSubcategoria('todos');
    } else {
      setCategoriaPrincipal(categoria);
      setSubcategoria('todos');
    }
    setPaginaActual(1);
  };

  const handleSubcategoriaClick = (sub) => {
    if (subcategoria === sub) {
      setSubcategoria('todos');
    } else {
      setSubcategoria(sub);
    }
    setPaginaActual(1);
  };

  const handlePromocionClick = () => {
    if (filtroPromocion === 'promocion') {
      setFiltroPromocion('todos');
    } else {
      setFiltroPromocion('promocion');
    }
    setPaginaActual(1);
  };

  const iconosCategoria = {
    'todos': '📦',
    'Bath & Body Works': '🧴',
    "Victoria's Secret": '🌸',
    'Perfumería': '🌺',
    'Moda': '👗',
    'Cuidado Personal': '🧖',
    'Accesorios': '👜',
  };

  if (cargando) {
    return (
      <>
        <Header />
        <main style={{
          minHeight: '100vh',
          backgroundColor: '#F6F0EA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <p>Cargando productos...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{
        minHeight: '100vh',
        backgroundColor: '#F6F0EA',
        color: '#111111',
        padding: '1rem',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '2.2rem',
            textAlign: 'center',
            color: '#111111',
            marginBottom: '0.3rem',
          }}>
            🛍️ Catálogo
          </h1>
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.95rem',
            textAlign: 'center',
            color: '#111111',
            opacity: 0.6,
            marginBottom: '1.5rem',
          }}>
            Explora todos nuestros productos
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            maxWidth: '700px',
            margin: '0 auto 1.5rem auto',
          }}>
            <input
              type="text"
              placeholder="🔍 Buscar productos..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
              style={{
                width: '100%',
                padding: '0.7rem 1rem',
                borderRadius: '9999px',
                border: '2px solid #E8A6AE',
                backgroundColor: '#FFFFFF',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.95rem',
                color: '#111111',
                outline: 'none',
                transition: 'box-shadow 0.3s',
              }}
              onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 4px rgba(232, 166, 174, 0.2)'}
              onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
            />

            <select
              value={productosPorPagina}
              onChange={(e) => cambiarProductosPorPagina(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.7rem 1rem',
                borderRadius: '9999px',
                border: '2px solid #E8A6AE',
                backgroundColor: '#FFFFFF',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.95rem',
                color: '#111111',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value={12}>Mostrar 12</option>
              <option value={24}>Mostrar 24</option>
              <option value={40}>Mostrar 40</option>
            </select>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem',
          }}>
            {categoriasUnicas.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoriaClick(cat)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  borderRadius: '9999px',
                  padding: '0.4rem 0.9rem',
                  border: categoriaPrincipal === cat ? '2px solid #E8A6AE' : '1px solid rgba(232, 166, 174, 0.3)',
                  backgroundColor: categoriaPrincipal === cat ? '#E8A6AE' : '#FFFFFF',
                  color: categoriaPrincipal === cat ? '#FFFFFF' : '#111111',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: categoriaPrincipal === cat ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: categoriaPrincipal === cat ? '0 4px 16px rgba(232, 166, 174, 0.4)' : '0 2px 8px rgba(0,0,0,0.06)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (categoriaPrincipal !== cat) {
                    e.currentTarget.style.backgroundColor = '#FBE4E7';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (categoriaPrincipal !== cat) {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <span>{iconosCategoria[cat] || '📦'}</span> {cat === 'todos' ? 'Todos' : cat}
              </button>
            ))}

            {hayPromociones && (
              <button
                onClick={handlePromocionClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  borderRadius: '9999px',
                  padding: '0.4rem 0.9rem',
                  border: filtroPromocion === 'promocion' ? '2px solid #E8A6AE' : '1px solid rgba(232, 166, 174, 0.3)',
                  backgroundColor: filtroPromocion === 'promocion' ? '#E8A6AE' : '#FFFFFF',
                  color: filtroPromocion === 'promocion' ? '#FFFFFF' : '#111111',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: filtroPromocion === 'promocion' ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: filtroPromocion === 'promocion' ? '0 4px 16px rgba(232, 166, 174, 0.4)' : '0 2px 8px rgba(0,0,0,0.06)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (filtroPromocion !== 'promocion') {
                    e.currentTarget.style.backgroundColor = '#FBE4E7';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filtroPromocion !== 'promocion') {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                🏷️ Promociones
              </button>
            )}
          </div>

          {categoriaPrincipal !== 'todos' && subcategoriasActuales.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.3rem',
              marginBottom: '1rem',
              padding: '0.3rem 0',
              borderTop: '1px solid rgba(232, 166, 174, 0.2)',
              borderBottom: '1px solid rgba(232, 166, 174, 0.2)',
            }}>
              <button
                onClick={() => {
                  setSubcategoria('todos');
                  setPaginaActual(1);
                }}
                style={{
                  borderRadius: '9999px',
                  padding: '0.2rem 0.8rem',
                  border: subcategoria === 'todos' ? '2px solid #C9A45C' : '1px solid rgba(201, 164, 92, 0.3)',
                  backgroundColor: subcategoria === 'todos' ? '#C9A45C' : 'transparent',
                  color: subcategoria === 'todos' ? '#FFFFFF' : '#111111',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.65rem',
                  fontWeight: subcategoria === 'todos' ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                Todas
              </button>
              {subcategoriasActuales.map((sub) => (
                <button
                  key={sub}
                  onClick={() => handleSubcategoriaClick(sub)}
                  style={{
                    borderRadius: '9999px',
                    padding: '0.2rem 0.8rem',
                    border: subcategoria === sub ? '2px solid #E8A6AE' : '1px solid rgba(232, 166, 174, 0.3)',
                    backgroundColor: subcategoria === sub ? '#E8A6AE' : 'transparent',
                    color: subcategoria === sub ? '#FFFFFF' : '#111111',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.65rem',
                    fontWeight: subcategoria === sub ? '600' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    if (subcategoria !== sub) {
                      e.currentTarget.style.backgroundColor = '#FBE4E7';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (subcategoria !== sub) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.8rem',
            textAlign: 'center',
            color: '#111111',
            opacity: 0.6,
            marginBottom: '1rem',
          }}>
            Mostrando {productosPaginados.length} de {totalProductos} productos
          </p>

          {productosPaginados.length > 0 ? (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '1rem',
              }}>
                {productosPaginados.map((producto) => (
                  <div
                    key={producto.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'center',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      border: '1px solid rgba(201, 164, 92, 0.08)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(232, 166, 174, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '0.3rem',
                      right: '0.3rem',
                      backgroundColor: '#FBE4E7',
                      borderRadius: '9999px',
                      padding: '0.1rem 0.4rem',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '0.4rem',
                      fontWeight: '600',
                      color: '#111111',
                      opacity: 0.6,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {producto.categoria}
                    </div>

                    {/* 🔥 ETIQUETA DE DESCUENTO EN LA IMAGEN */}
                    {producto.en_promocion === 1 && producto.descuento > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '0.3rem',
                        left: '0.3rem',
                        backgroundColor: '#E8A6AE',
                        color: '#FFFFFF',
                        borderRadius: '9999px',
                        padding: '0.2rem 0.6rem',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '0.6rem',
                        fontWeight: '700',
                        zIndex: 5,
                        boxShadow: '0 2px 8px rgba(232, 166, 174, 0.3)',
                      }}>
                        -{producto.descuento}%
                      </div>
                    )}

                    {producto.imagenPrincipal ? (
                      <img
                        src={producto.imagenPrincipal}
                        alt={producto.nombre}
                        style={{
                          width: '100%',
                          height: 'auto',
                          aspectRatio: '1/1',
                          objectFit: 'contain',
                          borderRadius: '8px',
                          marginBottom: '0.3rem',
                          backgroundColor: '#F6F0EA',
                        }}
                      />
                    ) : (
                      <div style={{ fontSize: '3.5rem', marginBottom: '0.3rem' }}>
                        {producto.emoji || '🧴'}
                      </div>
                    )}

                    <h3 style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: '#111111',
                      marginBottom: '0.1rem',
                    }}>
                      {producto.nombre}
                    </h3>

                    <p style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '0.7rem',
                      color: '#111111',
                      opacity: 0.5,
                      marginBottom: '0.1rem',
                    }}>
                      {producto.marca}
                    </p>

                    {/* 🔥 PRECIO CON PROMOCIÓN */}
                    <div style={{ marginBottom: '0.3rem' }}>
                      {producto.en_promocion === 1 && producto.precio_original ? (
                        <>
                          <p style={{
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '0.7rem',
                            fontWeight: '400',
                            color: '#111111',
                            opacity: 0.4,
                            textDecoration: 'line-through',
                            margin: 0,
                          }}>
                            L. {producto.precio_original}
                          </p>
                          <p style={{
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '1rem',
                            fontWeight: '700',
                            color: '#E8A6AE',
                            margin: 0,
                          }}>
                            L. {producto.precio}
                          </p>
                        </>
                      ) : (
                        <p style={{
                          fontFamily: 'Montserrat, sans-serif',
                          fontSize: '1rem',
                          fontWeight: '700',
                          color: '#C9A45C',
                          margin: 0,
                        }}>
                          L. {producto.precio}
                        </p>
                      )}
                    </div>

                    <a
                      href={`/producto/${producto.id}`}
                      style={{
                        display: 'inline-block',
                        borderRadius: '9999px',
                        backgroundColor: '#E8A6AE',
                        padding: '0.3rem 0.8rem',
                        border: 'none',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '0.65rem',
                        fontWeight: '600',
                        color: '#FFFFFF',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        width: '100%',
                        maxWidth: '120px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#D4959B';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#E8A6AE';
                      }}
                    >
                      Ver producto →
                    </a>
                  </div>
                ))}
              </div>

              {totalPaginas > 1 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem',
                  marginTop: '1.5rem',
                  padding: '1rem 0',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}>
                    <button
                      onClick={() => irAPagina(paginaActual - 1)}
                      style={{
                        padding: '0.3rem 0.8rem',
                        borderRadius: '9999px',
                        backgroundColor: '#E8A6AE',
                        color: '#FFFFFF',
                        border: 'none',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        opacity: paginaActual === 1 ? 0.5 : 1,
                      }}
                      disabled={paginaActual === 1}
                    >
                      ◀ Anterior
                    </button>

                    {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                      let numeroPagina;
                      if (totalPaginas <= 5) {
                        numeroPagina = i + 1;
                      } else if (paginaActual <= 3) {
                        numeroPagina = i + 1;
                      } else if (paginaActual >= totalPaginas - 2) {
                        numeroPagina = totalPaginas - 4 + i;
                      } else {
                        numeroPagina = paginaActual - 2 + i;
                      }
                      return (
                        <button
                          key={numeroPagina}
                          onClick={() => irAPagina(numeroPagina)}
                          style={{
                            padding: '0.3rem 0.7rem',
                            borderRadius: '50%',
                            backgroundColor: numeroPagina === paginaActual ? '#E8A6AE' : '#FFFFFF',
                            color: numeroPagina === paginaActual ? '#FFFFFF' : '#111111',
                            border: numeroPagina === paginaActual ? 'none' : '1px solid rgba(232, 166, 174, 0.3)',
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '0.75rem',
                            fontWeight: numeroPagina === paginaActual ? '600' : '500',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            minWidth: '32px',
                            height: '32px',
                          }}
                          onMouseEnter={(e) => {
                            if (numeroPagina !== paginaActual) {
                              e.currentTarget.style.backgroundColor = '#FBE4E7';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (numeroPagina !== paginaActual) {
                              e.currentTarget.style.backgroundColor = '#FFFFFF';
                            }
                          }}
                        >
                          {numeroPagina}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => irAPagina(paginaActual + 1)}
                      style={{
                        padding: '0.3rem 0.8rem',
                        borderRadius: '9999px',
                        backgroundColor: '#E8A6AE',
                        color: '#FFFFFF',
                        border: 'none',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        opacity: paginaActual === totalPaginas ? 0.5 : 1,
                      }}
                      disabled={paginaActual === totalPaginas}
                    >
                      Siguiente ▶
                    </button>
                  </div>
                  <p style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.7rem',
                    color: '#111111',
                    opacity: 0.5,
                  }}>
                    Página {paginaActual} de {totalPaginas}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '2rem 1rem',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                🔍
              </div>
              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.95rem',
                color: '#111111',
                opacity: 0.6,
              }}>
                No se encontraron productos disponibles
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}