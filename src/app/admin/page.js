// src/app/admin/page.js
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AdminLogin() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const admins = [
    { usuario: 'NLinares', contrasena: 'NJ03112006' },
    { usuario: 'CLinares', contrasena: 'Airi2017' },
    { usuario: 'ERojas', contrasena: 'Airi2017' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const adminEncontrado = admins.find(
      (a) => a.usuario === usuario && a.contrasena === contrasena
    );

    if (adminEncontrado) {
      localStorage.setItem('adminSession', JSON.stringify({
        usuario: adminEncontrado.usuario,
        loggedIn: true,
      }));
      router.push('/admin/dashboard');
    } else {
      setError('❌ Usuario o contraseña incorrectos');
    }
  };

  return (
    <>
      <Header />
      <main style={{
        minHeight: 'calc(100vh - 10rem)',
        backgroundColor: '#F6F0EA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '2.5rem',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔐</div>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.8rem',
              color: '#111111',
              marginBottom: '0.25rem',
            }}>
              Panel de Administración
            </h1>
            <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.9rem',
              color: '#111111',
              opacity: 0.6,
            }}>
              Inicia sesión para gestionar tu tienda
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.85rem',
                fontWeight: '500',
                color: '#111111',
                display: 'block',
                marginBottom: '0.3rem',
              }}>
                Usuario
              </label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '12px',
                  border: '2px solid #E8A6AE',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '1rem',
                  color: '#111111',
                  outline: 'none',
                  transition: 'box-shadow 0.3s',
                }}
                onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 4px rgba(232, 166, 174, 0.2)'}
                onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.85rem',
                fontWeight: '500',
                color: '#111111',
                display: 'block',
                marginBottom: '0.3rem',
              }}>
                Contraseña
              </label>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '12px',
                  border: '2px solid #E8A6AE',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '1rem',
                  color: '#111111',
                  outline: 'none',
                  transition: 'box-shadow 0.3s',
                }}
                onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 4px rgba(232, 166, 174, 0.2)'}
                onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
              />
            </div>

            {error && (
              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.85rem',
                color: '#F44336',
                textAlign: 'center',
                marginBottom: '1rem',
              }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                borderRadius: '9999px',
                backgroundColor: '#E8A6AE',
                padding: '0.9rem 1.5rem',
                border: 'none',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D4959B'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E8A6AE'}
            >
              Iniciar sesión
            </button>
          </form>

          <p style={{
            marginTop: '1rem',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.75rem',
            textAlign: 'center',
            color: '#111111',
            opacity: 0.4,
          }}>
            Usuarios: NLinares / CLinares / ERojas
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}