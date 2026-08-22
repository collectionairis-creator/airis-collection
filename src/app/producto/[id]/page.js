// src/app/producto/[id]/page.js
"use client";

import { useParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useState, useEffect } from 'react';
import { useCarrito } from '../../context/CarritoContext';
import Image from 'next/image';

export default function ProductoPage() {
  const params = useParams();
  const id = parseInt(params.id);
  const { agregarAlCarrito } = useCarrito();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [carritoMensaje, setCarritoMensaje] = useState('');
  const [indiceImagen, setIndiceImagen] = useState(0);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        setCargando(true);
        const res = await fetch(`/api/productos/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProducto(data);
        } else {
          setProducto(null);
        }
      } catch (error) {
        console.error('Error al cargar producto:', error);
        setProducto(null);
      } finally {
        setCargando(false);
      }
    };
    cargarProducto();
  }, [id]);

  const obtenerImagenes = () => {
    if (!producto) return [];
    const imagenes = [];
    if (producto.imagenPrincipal) imagenes.push(producto.imagenPrincipal);
    if (producto.imagen2) imagenes.push(producto.imagen2);
    if (producto.imagen3) imagenes.push(producto.imagen3);
    if (producto.imagen4) imagenes.push(producto.imagen4);
    return imagenes;
  };

  const imagenes = obtenerImagenes();
  const tieneImagenes = imagenes.length > 0;

  const siguienteImagen = () => {
    if (imagenes.length === 0) return;
    setIndiceImagen((prev) => (prev + 1) % imagenes.length);
  };

  const anteriorImagen = () => {
    if (imagenes.length === 0) return;
    setIndiceImagen((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  const handleAgregarAlCarrito = () => {
    if (!producto) return;
    
    const precioLimpio = producto.precio?.replace(/[^0-9.]/g, '') || '0';
    const precioNum = parseFloat(precioLimpio) || 0;
    
    const productoParaCarrito = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      precioNum: precioNum,
      emoji: producto.emoji || '🧴',
      imagenPrincipal: producto.imagenPrincipal || '',
      cantidad: cantidad,
      marca: producto.marca || '',
    };

    agregarAlCarrito(productoParaCarrito, cantidad);
    setCarritoMensaje(`✅ ${producto.nombre} agregado al carrito (${cantidad})`);
    setTimeout(() => setCarritoMensaje(''), 3000);
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
          <p>Cargando producto...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!producto) {
    return (
      <>
        <Header />
        <main style={{
          minHeight: '100vh',
          backgroundColor: '#F6F0EA',
          color: '#111111',
          padding: '2rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem' }}>
            Producto no encontrado
          </h1>
          <p style={{ fontFamily: 'Montserrat, sans-serif' }}>
            El producto que buscas no existe o fue eliminado.
          </p>
          <a href="/catalogo" style={{
            marginTop: '1rem',
            borderRadius: '9999px',
            backgroundColor: '#E8A6AE',
            padding: '0.6rem 1.5rem',
            color: '#FFFFFF',
            textDecoration: 'none',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: '600',
          }}>
            Volver al catálogo
          </a>
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
          maxWidth: '1000px',
          margin: '0 auto',
        }}>
          <a href="/catalogo" style={{
            display: 'inline-block',
            marginBottom: '1rem',
            color: '#111111',
            textDecoration: 'none',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.85rem',
            opacity: 0.6,
            transition: 'opacity 0.3s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
          >
            ← Volver al catálogo
          </a>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1.5rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}>
            {/* CARRUSEL DE IMÁGENES CON ETIQUETA DE DESCUENTO */}
            <div style={{
              position: 'relative',
              backgroundColor: '#F6F0EA',
              borderRadius: '12px',
              overflow: 'hidden',
              minHeight: '250px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* 🔥 ETIQUETA DE DESCUENTO EN LA IMAGEN */}
              {producto.en_promocion === 1 && producto.descuento > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '0.5rem',
                  left: '0.5rem',
                  backgroundColor: '#E8A6AE',
                  color: '#FFFFFF',
                  borderRadius: '9999px',
                  padding: '0.3rem 0.8rem',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  zIndex: 5,
                  boxShadow: '0 2px 8px rgba(232, 166, 174, 0.3)',
                }}>
                  🔥 -{producto.descuento}%
                </div>
              )}

              {tieneImagenes ? (
                <>
                  <Image
                    src={imagenes[indiceImagen]}
                    alt={`${producto.nombre} - Imagen ${indiceImagen + 1}`}
                    width={500}
                    height={500}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '350px',
                      objectFit: 'contain',
                    }}
                    priority
                  />
                  
                  {imagenes.length > 1 && (
                    <>
                      <button
                        onClick={anteriorImagen}
                        style={{
                          position: 'absolute',
                          left: '0.25rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 10,
                        }}
                      >
                        ◀
                      </button>
                      <button
                        onClick={siguienteImagen}
                        style={{
                          position: 'absolute',
                          right: '0.25rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 10,
                        }}
                      >
                        ▶
                      </button>
                      <div style={{
                        position: 'absolute',
                        bottom: '0.25rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: '0.4rem',
                        zIndex: 10,
                      }}>
                        {imagenes.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setIndiceImagen(index)}
                            style={{
                              width: index === indiceImagen ? '10px' : '6px',
                              height: index === indiceImagen ? '10px' : '6px',
                              borderRadius: '50%',
                              backgroundColor: index === indiceImagen ? '#E8A6AE' : 'rgba(255,255,255,0.5)',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.3s',
                            }}
                          />
                        ))}
                      </div>
                      <div style={{
                        position: 'absolute',
                        top: '0.25rem',
                        right: '0.25rem',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: '#FFFFFF',
                        borderRadius: '9999px',
                        padding: '0.1rem 0.6rem',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '0.6rem',
                        fontWeight: '600',
                        zIndex: 10,
                      }}>
                        {indiceImagen + 1} / {imagenes.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div style={{ fontSize: '6rem' }}>
                  {producto.emoji || '🖼️'}
                </div>
              )}
            </div>

            {/* INFORMACIÓN DEL PRODUCTO CON PROMOCIÓN */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}>
              <h1 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.6rem',
                color: '#111111',
                marginBottom: '0.1rem',
              }}>
                {producto.nombre}
              </h1>

              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.9rem',
                color: '#111111',
                opacity: 0.6,
              }}>
                {producto.marca || 'Airi\'s Collection'}
              </p>

              {/* 🔥 PRECIO CON PROMOCIÓN */}
              <div style={{ marginBottom: '0.2rem' }}>
                {producto.en_promocion === 1 && producto.precio_original ? (
                  <>
                    <p style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '1rem',
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
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      color: '#E8A6AE',
                      margin: 0,
                    }}>
                      L. {producto.precio}
                      <span style={{
                        fontSize: '0.8rem',
                        backgroundColor: '#E8A6AE',
                        color: '#FFFFFF',
                        padding: '0.1rem 0.6rem',
                        borderRadius: '9999px',
                        marginLeft: '0.5rem',
                      }}>
                        -{producto.descuento}%
                      </span>
                    </p>
                  </>
                ) : (
                  <p style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#C9A45C',
                    margin: 0,
                  }}>
                    L. {producto.precio}
                  </p>
                )}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '0.2rem',
              }}>
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: producto.disponible ? '#4CAF50' : '#F44336',
                }} />
                <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: producto.disponible ? '#4CAF50' : '#F44336',
                }}>
                  {producto.disponible ? 'Disponible' : 'Agotado'}
                </span>
              </div>

              <div style={{
                borderTop: '1px solid rgba(0,0,0,0.06)',
                paddingTop: '0.5rem',
                marginTop: '0.2rem',
              }}>
                <p style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.85rem',
                  color: '#111111',
                  opacity: 0.8,
                  lineHeight: '1.5',
                }}>
                  {producto.descripcion || 'Sin descripción disponible.'}
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: '0.3rem',
                flexWrap: 'wrap',
              }}>
                <span style={{
                  backgroundColor: '#FBE4E7',
                  borderRadius: '9999px',
                  padding: '0.1rem 0.6rem',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.6rem',
                  fontWeight: '600',
                  color: '#111111',
                }}>
                  {producto.categoria}
                </span>
                {producto.subcategoria && (
                  <span style={{
                    backgroundColor: '#F6F0EA',
                    borderRadius: '9999px',
                    padding: '0.1rem 0.6rem',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.6rem',
                    fontWeight: '500',
                    color: '#111111',
                    opacity: 0.7,
                  }}>
                    {producto.subcategoria}
                  </span>
                )}
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                marginTop: '0.3rem',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <label style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                  }}>
                    Cantidad:
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #E8A6AE',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}>
                    <button
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      style={{
                        padding: '0.2rem 0.6rem',
                        border: 'none',
                        backgroundColor: '#FBE4E7',
                        cursor: 'pointer',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      }}
                    >
                      -
                    </button>
                    <span style={{
                      padding: '0.2rem 0.8rem',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                    }}>
                      {cantidad}
                    </span>
                    <button
                      onClick={() => setCantidad(cantidad + 1)}
                      style={{
                        padding: '0.2rem 0.6rem',
                        border: 'none',
                        backgroundColor: '#FBE4E7',
                        cursor: 'pointer',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAgregarAlCarrito}
                  disabled={!producto.disponible}
                  style={{
                    borderRadius: '9999px',
                    backgroundColor: producto.disponible ? '#E8A6AE' : '#CCCCCC',
                    padding: '0.7rem 1rem',
                    border: 'none',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    cursor: producto.disponible ? 'pointer' : 'not-allowed',
                    transition: 'background-color 0.3s',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    if (producto.disponible) {
                      e.currentTarget.style.backgroundColor = '#D4959B';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (producto.disponible) {
                      e.currentTarget.style.backgroundColor = '#E8A6AE';
                    }
                  }}
                >
                  🛒 Agregar al carrito
                </button>

                <a
                  href={`https://wa.me/50488633658?text=Hola%21%20Quisiera%20consultar%20sobre%20${encodeURIComponent(producto.nombre)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    borderRadius: '9999px',
                    padding: '0.7rem 1rem',
                    border: '2px solid #25D366',
                    backgroundColor: 'transparent',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#25D366',
                    textAlign: 'center',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    width: '100%',
                    display: 'block',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#25D366';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#25D366';
                  }}
                >
                  💬 Consultar por WhatsApp
                </a>

                {carritoMensaje && (
                  <p style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.8rem',
                    color: '#4CAF50',
                    fontWeight: '600',
                    textAlign: 'center',
                  }}>
                    {carritoMensaje}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}