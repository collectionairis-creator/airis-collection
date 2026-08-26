// src/components/Header.jsx
"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useCarrito } from '../context/CarritoContext';
import Link from 'next/link';

export default function Header() {
  const { contador, carrito, total, quitarDelCarrito, actualizarCantidad, abrirWhatsApp, formatearPrecio } = useCarrito();
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  return (
    <>
      <header style={{
        borderBottom: '1px solid rgba(232, 166, 174, 0.3)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        padding: '0.5rem 1rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {/* LOGO */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Image
              src="/imagenes/identidad/logo-horizontal.png"
              alt="Airi's Collection"
              width={160}
              height={40}
              style={{ height: '35px', width: 'auto' }}
              priority
            />
          </Link>

          {/* NAVEGACIÓN */}
          <nav style={{
            display: 'none',
            gap: '1.5rem',
            alignItems: 'center',
          }}
          className="nav-desktop"
          >
            <Link href="/" style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.8rem',
              fontWeight: '500',
              color: '#111111',
              textDecoration: 'none',
            }}>
              Inicio
            </Link>
            <Link href="/catalogo" style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.8rem',
              fontWeight: '500',
              color: '#111111',
              textDecoration: 'none',
            }}>
              Catálogo
            </Link>
            <Link href="/quienes-somos" style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.8rem',
              fontWeight: '500',
              color: '#111111',
              textDecoration: 'none',
            }}>
              Quiénes somos
            </Link>
            <Link href="/contacto" style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.8rem',
              fontWeight: '500',
              color: '#111111',
              textDecoration: 'none',
            }}>
              Contacto
            </Link>
          </nav>

          {/* CARRITO Y MENÚ MÓVIL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setCarritoAbierto(true)}
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.3rem',
              }}
            >
              🛍️
              {contador > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: '#E8A6AE',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.55rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {contador}
                </span>
              )}
            </button>
            
            <button style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.3rem',
              display: 'block',
            }}
            className="menu-mobile"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* PANEL DEL CARRITO - CON IMÁGENES DE PRODUCTOS */}
      {carritoAbierto && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          maxWidth: '380px',
          height: '100vh',
          backgroundColor: '#FFFFFF',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '1rem',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.3rem',
              color: '#111111',
              margin: 0,
            }}>
              🛍️ Carrito
            </h2>
            <button
              onClick={() => setCarritoAbierto(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.3rem',
                cursor: 'pointer',
                color: '#111111',
                opacity: 0.5,
              }}
            >
              ✕
            </button>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
          }}>
            {carrito.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem 0',
              }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
                  🛒
                </div>
                <p style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.9rem',
                  color: '#111111',
                  opacity: 0.6,
                }}>
                  Tu carrito está vacío
                </p>
                <button
                  onClick={() => setCarritoAbierto(false)}
                  style={{
                    marginTop: '1rem',
                    borderRadius: '9999px',
                    backgroundColor: '#E8A6AE',
                    padding: '0.5rem 1.2rem',
                    border: 'none',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                  }}
                >
                  Seguir comprando
                </button>
              </div>
            ) : (
              <>
                {carrito.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.7rem',
                      padding: '0.5rem 0',
                      borderBottom: '1px solid rgba(0,0,0,0.04)',
                    }}
                  >
                    {/* 🔥 IMAGEN DEL PRODUCTO EN EL CARRITO */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#F6F0EA',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}>
                      {item.imagenPrincipal ? (
                        <img
                          src={item.imagenPrincipal}
                          alt={item.nombre}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '2rem' }}>{item.emoji || '🧴'}</span>
                      )}
                    </div>

                    <div style={{
                      flex: 1,
                    }}>
                      <h4 style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#111111',
                        margin: 0,
                      }}>
                        {item.nombre}
                      </h4>
                      <p style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '0.65rem',
                        color: '#111111',
                        opacity: 0.5,
                        margin: 0,
                      }}>
                        {item.precio}
                      </p>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                    }}>
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                        style={{
                          background: '#FBE4E7',
                          border: 'none',
                          borderRadius: '4px',
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                        }}
                      >
                        -
                      </button>
                      <span style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        minWidth: '20px',
                        textAlign: 'center',
                      }}>
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                        style={{
                          background: '#FBE4E7',
                          border: 'none',
                          borderRadius: '4px',
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => quitarDelCarrito(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        opacity: 0.4,
                        padding: '0.2rem',
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>

          {carrito.length > 0 && (
            <div style={{
              padding: '1rem',
              borderTop: '1px solid rgba(0,0,0,0.06)',
              backgroundColor: '#F6F0EA',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.3rem',
              }}>
                <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#111111',
                }}>
                  Total:
                </span>
                <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#C9A45C',
                }}>
                  {formatearPrecio(total)}
                </span>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem',
              }}>
                <button
                  onClick={() => {
                    abrirWhatsApp();
                    setCarritoAbierto(false);
                  }}
                  style={{
                    borderRadius: '9999px',
                    backgroundColor: '#25D366',
                    padding: '0.6rem 1rem',
                    border: 'none',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1DA851'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#25D366'}
                >
                  💬 Consultar pedido por WhatsApp
                </button>
                <Link href="/carrito" style={{
                  borderRadius: '9999px',
                  backgroundColor: '#E8A6AE',
                  padding: '0.6rem 1rem',
                  border: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D4959B'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E8A6AE'}
                onClick={() => setCarritoAbierto(false)}
                >
                  📋 Ver carrito completo
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}