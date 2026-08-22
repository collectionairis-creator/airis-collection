// src/app/components/Carrusel.jsx
"use client";

import { useState, useEffect } from 'react';

export default function Carrusel({ productos }) {
  const [indiceActual, setIndiceActual] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const productosData = productos || [];

  // Si no hay productos, no mostrar nada
  if (productosData.length === 0) {
    return null;
  }

  const totalProductos = productosData.length;

  // Autoplay
  useEffect(() => {
    if (isPaused || totalProductos === 0) return;
    const intervalo = setInterval(() => {
      setIndiceActual((prev) => (prev + 1) % totalProductos);
    }, 3000);
    return () => clearInterval(intervalo);
  }, [totalProductos, isPaused]);

  const irAProducto = (indice) => {
    setIndiceActual((indice + totalProductos) % totalProductos);
  };

  const siguiente = () => {
    setIndiceActual((prev) => (prev + 1) % totalProductos);
  };

  const anterior = () => {
    setIndiceActual((prev) => (prev - 1 + totalProductos) % totalProductos);
  };

  const indiceAnterior = (indiceActual - 1 + totalProductos) % totalProductos;
  const indiceSiguiente = (indiceActual + 1) % totalProductos;

  return (
    <div
      style={{
        position: 'relative',
        maxWidth: '900px',
        margin: '0 auto',
        padding: '1rem 0',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          transition: 'all 0.5s ease',
        }}
      >
        {/* Producto anterior */}
        <div
          style={{
            flex: '0 0 25%',
            transform: 'scale(0.85)',
            opacity: 0.4,
            filter: 'blur(2px)',
            transition: 'all 0.5s ease',
            cursor: 'pointer',
          }}
          onClick={() => irAProducto(indiceAnterior)}
        >
          <div
            style={{
              backgroundColor: '#F6F0EA',
              borderRadius: '16px',
              padding: '1.5rem',
              textAlign: 'center',
              border: '1px solid rgba(201, 164, 92, 0.15)',
            }}
          >
            {productosData[indiceAnterior].imagenPrincipal ? (
              <img
                src={productosData[indiceAnterior].imagenPrincipal}
                alt={productosData[indiceAnterior].nombre}
                style={{
                  width: '100%',
                  height: '80px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  marginBottom: '0.3rem',
                  backgroundColor: '#F6F0EA',
                }}
              />
            ) : (
              <div style={{ fontSize: '3rem' }}>{productosData[indiceAnterior].emoji}</div>
            )}
            <h3
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#111111',
                marginBottom: '0.1rem',
              }}
            >
              {productosData[indiceAnterior].nombre}
            </h3>
            <p
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.7rem',
                color: '#C9A45C',
                fontWeight: '600',
              }}
            >
              {productosData[indiceAnterior].precio}
            </p>
          </div>
        </div>

        {/* Producto actual */}
        <div
          style={{
            flex: '0 0 40%',
            transform: 'scale(1)',
            zIndex: 10,
            transition: 'all 0.5s ease',
            boxShadow: '0 8px 32px rgba(232, 166, 174, 0.25)',
            borderRadius: '20px',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(201, 164, 92, 0.1)',
          }}
        >
          <a
            href={`/producto/${productosData[indiceActual].id}`}
            style={{
              display: 'block',
              padding: '2rem 1.5rem',
              textDecoration: 'none',
              color: '#111111',
              borderRadius: '20px',
              transition: 'transform 0.3s',
            }}
          >
            {productosData[indiceActual].imagenPrincipal ? (
              <img
                src={productosData[indiceActual].imagenPrincipal}
                alt={productosData[indiceActual].nombre}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                  backgroundColor: '#F6F0EA',
                }}
              />
            ) : (
              <div style={{ fontSize: '5rem', textAlign: 'center', marginBottom: '0.5rem' }}>
                {productosData[indiceActual].emoji}
              </div>
            )}
            <h2
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '1.3rem',
                fontWeight: '700',
                textAlign: 'center',
                color: '#111111',
                marginBottom: '0.25rem',
              }}
            >
              {productosData[indiceActual].nombre}
            </h2>
            <p
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.9rem',
                textAlign: 'center',
                color: '#111111',
                opacity: 0.6,
                marginBottom: '0.5rem',
              }}
            >
              {productosData[indiceActual].marca}
            </p>
            <p
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '1.5rem',
                fontWeight: '700',
                textAlign: 'center',
                color: '#C9A45C',
                marginBottom: '0.75rem',
              }}
            >
              {productosData[indiceActual].precio}
            </p>
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  window.open(`/producto/${productosData[indiceActual].id}`, '_blank');
                }}
                style={{
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #E8A6AE 0%, #D4959B 100%)',
                  color: '#FFFFFF',
                  padding: '0.6rem 2rem',
                  border: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(232, 166, 174, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(232, 166, 174, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(232, 166, 174, 0.3)';
                }}
              >
                ✨ Ver producto
              </button>
            </div>
          </a>
        </div>

        {/* Producto siguiente */}
        <div
          style={{
            flex: '0 0 25%',
            transform: 'scale(0.85)',
            opacity: 0.4,
            filter: 'blur(2px)',
            transition: 'all 0.5s ease',
            cursor: 'pointer',
          }}
          onClick={() => irAProducto(indiceSiguiente)}
        >
          <div
            style={{
              backgroundColor: '#F6F0EA',
              borderRadius: '16px',
              padding: '1.5rem',
              textAlign: 'center',
              border: '1px solid rgba(201, 164, 92, 0.15)',
            }}
          >
            {productosData[indiceSiguiente].imagenPrincipal ? (
              <img
                src={productosData[indiceSiguiente].imagenPrincipal}
                alt={productosData[indiceSiguiente].nombre}
                style={{
                  width: '100%',
                  height: '80px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  marginBottom: '0.3rem',
                  backgroundColor: '#F6F0EA',
                }}
              />
            ) : (
              <div style={{ fontSize: '3rem' }}>{productosData[indiceSiguiente].emoji}</div>
            )}
            <h3
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#111111',
                marginBottom: '0.1rem',
              }}
            >
              {productosData[indiceSiguiente].nombre}
            </h3>
            <p
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.7rem',
                color: '#C9A45C',
                fontWeight: '600',
              }}
            >
              {productosData[indiceSiguiente].precio}
            </p>
          </div>
        </div>
      </div>

      {/* Controles de navegación */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '1.5rem',
        }}
      >
        <button
          onClick={anterior}
          style={{
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #E8A6AE 0%, #D4959B 100%)',
            color: '#FFFFFF',
            width: '44px',
            height: '44px',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 2px 8px rgba(232, 166, 174, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(232, 166, 174, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(232, 166, 174, 0.3)';
          }}
        >
          ◀
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          {productosData.map((_, index) => (
            <button
              key={index}
              onClick={() => irAProducto(index)}
              style={{
                width: index === indiceActual ? '12px' : '8px',
                height: index === indiceActual ? '12px' : '8px',
                borderRadius: '50%',
                backgroundColor: index === indiceActual ? '#C9A45C' : '#D1D1D1',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: index === indiceActual ? '0 0 8px rgba(201, 164, 92, 0.3)' : 'none',
              }}
            />
          ))}
        </div>

        <button
          onClick={siguiente}
          style={{
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #E8A6AE 0%, #D4959B 100%)',
            color: '#FFFFFF',
            width: '44px',
            height: '44px',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 2px 8px rgba(232, 166, 174, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(232, 166, 174, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(232, 166, 174, 0.3)';
          }}
        >
          ▶
        </button>
      </div>
    </div>
  );
}