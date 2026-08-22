// src/app/page.js
"use client";

import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Carrusel from './components/Carrusel';

export default function Home() {
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Cargar productos destacados desde la base de datos
  useEffect(() => {
    const cargarDestacados = async () => {
      try {
        setCargando(true);
        const res = await fetch('/api/productos');
        const data = await res.json();
        // Filtrar solo los productos destacados y disponibles
        const destacados = data.filter(p => p.destacado === 1 && p.disponible === 1);
        setProductosDestacados(destacados);
      } catch (error) {
        console.error('Error al cargar productos destacados:', error);
      } finally {
        setCargando(false);
      }
    };
    cargarDestacados();
  }, []);

  // Si no hay productos destacados, mostrar mensaje
  const mostrarCarrusel = productosDestacados.length > 0;

  return (
    <>
      <Header />
      <main style={{
        backgroundColor: '#F6F0EA',
        color: '#111111',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* MARIPOSAS DECORATIVAS */}
        <div style={{
          position: 'absolute',
          fontSize: '6rem',
          opacity: 0.06,
          top: '5%',
          right: '8%',
          transform: 'rotate(15deg)',
          pointerEvents: 'none',
          zIndex: 0,
        }}>🦋</div>

        <div style={{
          position: 'absolute',
          fontSize: '4rem',
          opacity: 0.05,
          bottom: '15%',
          left: '5%',
          transform: 'rotate(-10deg)',
          pointerEvents: 'none',
          zIndex: 0,
        }}>🦋</div>

        <div style={{
          position: 'absolute',
          fontSize: '3rem',
          opacity: 0.04,
          top: '40%',
          left: '20%',
          transform: 'rotate(25deg)',
          pointerEvents: 'none',
          zIndex: 0,
        }}>🦋</div>

        {/* SECCIÓN HERO */}
        <section style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 10rem)',
          maxWidth: '64rem',
          margin: '0 auto',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          background: 'linear-gradient(135deg, #F6F0EA 0%, #FBE4E7 50%, #F6F0EA 100%)',
        }}>
          <div style={{
            fontSize: '2rem',
            marginBottom: '0.5rem',
            opacity: 0.3,
          }}>🦋</div>

          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '4.5rem',
            fontWeight: '700',
            color: '#111111',
            marginBottom: '0.5rem',
            textShadow: '0 2px 10px rgba(232, 166, 174, 0.15)',
            letterSpacing: '-0.02em',
          }}>
            Airi's Collection
          </h1>

          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.6rem',
            fontStyle: 'italic',
            color: '#C9A45C',
            marginTop: '0.5rem',
            textShadow: '0 1px 8px rgba(201, 164, 92, 0.15)',
          }}>
            Descubre el lujo en cada detalle
          </p>

          <p style={{
            marginTop: '1.5rem',
            maxWidth: '36rem',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '1.125rem',
            lineHeight: '2rem',
            color: '#111111',
            opacity: 0.8,
          }}>
            Accesorios, aromas y detalles especiales para consentirte y encontrar ese toque único que te hace brillar.
          </p>

          <div style={{
            marginTop: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
            maxWidth: '300px',
          }}>
            <a href="/catalogo" style={{
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #E8A6AE 0%, #D4959B 100%)',
              padding: '0.9rem 1.75rem',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: '600',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              textDecoration: 'none',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(232, 166, 174, 0.35)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(232, 166, 174, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(232, 166, 174, 0.35)';
            }}>
              ✨ Ver colección
            </a>

            <a
              href="https://wa.me/50488633658?text=Hola%21%20Quisiera%20consultar%20sobre%20los%20productos%20de%20Airi%27s%20Collection."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                borderRadius: '9999px',
                padding: '0.9rem 1.75rem',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: '600',
                color: '#111111',
                border: '2px solid #E8A6AE',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.3s',
                textDecoration: 'none',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E8A6AE';
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#111111';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              💬 Hablar por WhatsApp
            </a>
          </div>
        </section>

        {/* SECCIÓN PRODUCTOS DESTACADOS - desde la base de datos */}
        <section style={{
          padding: '3rem 1.5rem',
          backgroundColor: '#FFFFFF',
          position: 'relative',
          zIndex: 1,
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              marginBottom: '0.5rem',
            }}>
              <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>🦋</span>
              <h2 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '2.5rem',
                textAlign: 'center',
                color: '#111111',
              }}>
                Encuentra el detalle perfecto
              </h2>
              <span style={{ fontSize: '1.5rem', opacity: 0.5, transform: 'scaleX(-1)' }}>🦋</span>
            </div>
            <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '1rem',
              textAlign: 'center',
              color: '#111111',
              opacity: 0.6,
              marginBottom: '2rem',
            }}>
              Productos seleccionados especialmente para ti
            </p>

            {cargando ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem 0',
              }}>
                <p>Cargando productos destacados...</p>
              </div>
            ) : mostrarCarrusel ? (
              <Carrusel productos={productosDestacados} />
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '2rem 0',
                backgroundColor: '#F6F0EA',
                borderRadius: '16px',
              }}>
                <p style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '1rem',
                  color: '#111111',
                  opacity: 0.6,
                }}>
                  No hay productos destacados disponibles.
                </p>
                <p style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.85rem',
                  color: '#111111',
                  opacity: 0.4,
                  marginTop: '0.5rem',
                }}>
                  Marca productos como destacados desde el panel de administración.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}