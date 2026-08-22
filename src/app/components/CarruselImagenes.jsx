// src/app/components/CarruselImagenes.jsx
"use client";

import { useState } from 'react';
import Image from 'next/image';

export default function CarruselImagenes({ imagenes, nombreProducto, emoji }) {
  const [indiceActual, setIndiceActual] = useState(0);

  // Verificar si hay imágenes reales (no emojis)
  const tieneImagenes = imagenes && imagenes.length > 0 && imagenes[0] !== emoji;

  // Si NO hay imágenes reales, mostrar el emoji
  if (!tieneImagenes) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F6F0EA',
        borderRadius: '16px',
        padding: '2rem',
        minHeight: '300px',
      }}>
        <div style={{ fontSize: '8rem' }}>
          {emoji || '🖼️'}
        </div>
      </div>
    );
  }

  // Si HAY imágenes reales, mostrar el carrusel
  const siguiente = () => {
    setIndiceActual((prev) => (prev + 1) % imagenes.length);
  };

  const anterior = () => {
    setIndiceActual((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  return (
    <div style={{
      position: 'relative',
      backgroundColor: '#F6F0EA',
      borderRadius: '16px',
      overflow: 'hidden',
      minHeight: '300px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Image
        src={imagenes[indiceActual]}
        alt={`${nombreProducto} - Imagen ${indiceActual + 1}`}
        width={500}
        height={500}
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '400px',
          objectFit: 'contain',
        }}
        priority
      />

      {imagenes.length > 1 && (
        <>
          <button
            onClick={anterior}
            style={{
              position: 'absolute',
              left: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.8)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)'}
          >
            ◀
          </button>

          <button
            onClick={siguiente}
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.8)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)'}
          >
            ▶
          </button>

          <div style={{
            position: 'absolute',
            bottom: '0.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '0.5rem',
          }}>
            {imagenes.map((_, index) => (
              <button
                key={index}
                onClick={() => setIndiceActual(index)}
                style={{
                  width: index === indiceActual ? '12px' : '8px',
                  height: index === indiceActual ? '12px' : '8px',
                  borderRadius: '50%',
                  backgroundColor: index === indiceActual ? '#E8A6AE' : 'rgba(255,255,255,0.5)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>

          <div style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: '#FFFFFF',
            borderRadius: '9999px',
            padding: '0.2rem 0.8rem',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.7rem',
            fontWeight: '600',
          }}>
            {indiceActual + 1} / {imagenes.length}
          </div>
        </>
      )}
    </div>
  );
}