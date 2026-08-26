// src/app/carrito/page.js
"use client";

import { useCarrito } from '../context/CarritoContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function CarritoPage() {
  const { carrito, total, quitarDelCarrito, actualizarCantidad, vaciarCarrito, formatearPrecio, abrirWhatsApp } = useCarrito();

  // 🔥 Función para optimizar imagen
  const optimizarImagen = (url) => {
    if (!url) return '';
    if (url.includes('supabase.co')) {
      return `${url}?width=60&height=60&resize=contain&quality=80`;
    }
    return url;
  };

  if (carrito.length === 0) {
    return (
      <>
        <Header />
        <main style={{
          minHeight: 'calc(100vh - 10rem)',
          backgroundColor: '#F6F0EA',
          padding: '2rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '2rem',
            color: '#111111',
          }}>
            Tu carrito está vacío
          </h1>
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            color: '#111111',
            opacity: 0.6,
          }}>
            ¡Explora nuestro catálogo y encuentra el detalle perfecto!
          </p>
          <Link href="/catalogo" style={{
            marginTop: '1.5rem',
            borderRadius: '9999px',
            backgroundColor: '#E8A6AE',
            padding: '0.8rem 2rem',
            color: '#FFFFFF',
            textDecoration: 'none',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: '600',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D4959B'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E8A6AE'}>
            Ver catálogo
          </Link>
        </main>
        <Footer />
      </>
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
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '2.2rem',
            color: '#111111',
            textAlign: 'center',
            marginBottom: '0.5rem',
          }}>
            🛒 Carrito
          </h1>
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.9rem',
            textAlign: 'center',
            color: '#111111',
            opacity: 0.6,
            marginBottom: '2rem',
          }}>
            {carrito.length} {carrito.length === 1 ? 'producto' : 'productos'} en tu carrito
          </p>

          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            {carrito.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.8rem 0',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                }}
              >
                {/* 🔥 IMAGEN OPTIMIZADA EN EL CARRITO */}
                {item.imagenPrincipal ? (
                  <img
                    src={optimizarImagen(item.imagenPrincipal)}
                    alt={item.nombre}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      backgroundColor: '#F6F0EA',
                    }}
                  />
                ) : (
                  <div style={{
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    backgroundColor: '#F6F0EA',
                    borderRadius: '8px',
                  }}>
                    {item.emoji || '🧴'}
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: '#111111',
                    margin: 0,
                  }}>
                    {item.nombre}
                  </h3>
                  <p style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.8rem',
                    color: '#111111',
                    opacity: 0.5,
                    margin: 0,
                  }}>
                    {item.marca || 'Airi\'s Collection'}
                  </p>
                  <p style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    color: '#C9A45C',
                    margin: '0.2rem 0 0 0',
                  }}>
                    {formatearPrecio(item.precio)}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <button
                    onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: '1px solid #E8A6AE',
                      backgroundColor: '#FFFFFF',
                      color: '#111111',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    -
                  </button>
                  <span style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    minWidth: '24px',
                    textAlign: 'center',
                  }}>
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: '1px solid #E8A6AE',
                      backgroundColor: '#FFFFFF',
                      color: '#111111',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => quitarDelCarrito(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#F44336',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      padding: '0 0.3rem',
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            <div style={{
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '2px solid rgba(0,0,0,0.06)',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}>
                <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#111111',
                }}>
                  Total:
                </span>
                <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#C9A45C',
                }}>
                  {formatearPrecio(total)}
                </span>
              </div>
              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.75rem',
                color: '#111111',
                opacity: 0.4,
                textAlign: 'right',
                margin: 0,
              }}>
                *Los precios ya incluyen descuentos aplicados
              </p>

              <div style={{
                display: 'flex',
                gap: '0.75rem',
                marginTop: '1rem',
                flexWrap: 'wrap',
              }}>
                <button
                  onClick={vaciarCarrito}
                  style={{
                    borderRadius: '9999px',
                    backgroundColor: '#F44336',
                    padding: '0.7rem 1.5rem',
                    border: 'none',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    flex: 1,
                    minWidth: '120px',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D32F2F'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F44336'}
                >
                  🗑️ Vaciar carrito
                </button>
                <button
                  onClick={abrirWhatsApp}
                  style={{
                    borderRadius: '9999px',
                    backgroundColor: '#25D366',
                    padding: '0.7rem 1.5rem',
                    border: 'none',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    flex: 1,
                    minWidth: '120px',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1DA851'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#25D366'}
                >
                  💬 Enviar pedido a WhatsApp
                </button>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '1.5rem',
            textAlign: 'center',
          }}>
            <Link href="/catalogo" style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.85rem',
              color: '#111111',
              opacity: 0.6,
              textDecoration: 'none',
              transition: 'opacity 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}>
              ← Seguir comprando
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}