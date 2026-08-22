// src/app/components/Footer.jsx
"use client";

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#FBE4E7',
      padding: '1.5rem 1rem',
      marginTop: 'auto',
      borderTop: '1px solid #E8A6AE',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        padding: '0 1.5rem',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.1rem',
          color: '#111111',
          marginBottom: '0.2rem',
          fontWeight: '600',
        }}>
          ¿Quieres hacer tu pedido?
        </h2>

        <p style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '0.85rem',
          color: '#111111',
          marginBottom: '0.8rem',
        }}>
          Escríbenos por WhatsApp o Instagram
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1.5rem',
          marginBottom: '0.8rem',
          flexWrap: 'wrap',
        }}>
          <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.1rem',
            color: '#111111',
            textDecoration: 'none',
          }}>
            <span style={{ fontSize: '1.3rem' }}>💬</span>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem' }}>
              WhatsApp
            </span>
          </a>

          <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.1rem',
            color: '#111111',
            textDecoration: 'none',
          }}>
            <span style={{ fontSize: '1.3rem' }}>📸</span>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem' }}>
              Instagram
            </span>
          </a>

          <a href="/preguntas-frecuentes" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.1rem',
            color: '#111111',
            textDecoration: 'none',
          }}>
            <span style={{ fontSize: '1.3rem' }}>❓</span>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem' }}>
              Preguntas frecuentes
            </span>
          </a>
        </div>

        <div style={{
          borderTop: '1px solid rgba(232, 166, 174, 0.2)',
          paddingTop: '0.5rem',
          marginTop: '0.2rem',
        }}>
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.6rem',
            color: 'rgba(17, 17, 17, 0.4)',
            margin: 0,
          }}>
            © {new Date().getFullYear()} Airi's Collection
          </p>
        </div>
      </div>
    </footer>
  );
}