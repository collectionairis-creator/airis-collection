// src/app/admin/dashboard/page.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

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
    const cargarProductos = async () => {
      try {
        setCargando(true);
        setError(null);
        const res = await fetch('/api/productos');
        
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        setProductos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setProductos([]);
        setError('No se pudieron cargar los productos');
      } finally {
        setCargando(false);
      }
    };
    if (admin) {
      cargarProductos();
    }
  }, [admin]);

  const productosArray = Array.isArray(productos) ? productos : [];

  // Estadísticas
  const totalProductos = productosArray.length;
  const disponibles = productosArray.filter(p => p.disponible === 1).length;
  const agotados = productosArray.filter(p => p.disponible === 0).length;
  const destacados = productosArray.filter(p => p.destacado === 1).length;
  
  const productosStockBajo = productosArray.filter(p => p.stock > 0 && p.stock <= (p.stock_minimo || 5));
  const productosAgotados = productosArray.filter(p => p.stock === 0);
  const productosEnPromocion = productosArray.filter(p => p.en_promocion === 1 && p.disponible === 1);
  const productosStockNormal = productosArray.filter(p => p.stock > (p.stock_minimo || 5) && p.disponible === 1);

  // 🔥 EXPORTAR A EXCEL
  const exportarExcel = () => {
    if (productosArray.length === 0) {
      alert('No hay productos para exportar');
      return;
    }

    // Crear datos para Excel
    const datos = productosArray.map(p => ({
      'ID': p.id,
      'Nombre': p.nombre,
      'Categoría': p.categoria,
      'Subcategoría': p.subcategoria || '',
      'Marca': p.marca || '',
      'Precio': p.precio,
      'Precio Original': p.precio_original || '',
      'Descuento': p.descuento || '0%',
      'En Promoción': p.en_promocion ? 'Sí' : 'No',
      'Stock': p.stock || 0,
      'Stock Mínimo': p.stock_minimo || 5,
      'Disponible': p.disponible ? 'Sí' : 'No',
      'Destacado': p.destacado ? 'Sí' : 'No',
      'Fecha Creación': new Date(p.createdAt).toLocaleDateString('es-HN'),
    }));

    // Crear libro de Excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datos);
    
    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 8 },  // ID
      { wch: 25 }, // Nombre
      { wch: 20 }, // Categoría
      { wch: 20 }, // Subcategoría
      { wch: 20 }, // Marca
      { wch: 12 }, // Precio
      { wch: 15 }, // Precio Original
      { wch: 12 }, // Descuento
      { wch: 15 }, // En Promoción
      { wch: 10 }, // Stock
      { wch: 12 }, // Stock Mínimo
      { wch: 12 }, // Disponible
      { wch: 12 }, // Destacado
      { wch: 15 }, // Fecha Creación
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
    
    // Generar y descargar
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `inventario-airis-${fecha}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
  };

  // 🔥 EXPORTAR A PDF
  const exportarPDF = () => {
    if (productosArray.length === 0) {
      alert('No hay productos para exportar');
      return;
    }

    const doc = new jsPDF('landscape', 'mm', 'a4');
    const fecha = new Date().toLocaleDateString('es-HN');

    // Título
    doc.setFontSize(18);
    doc.setTextColor('#E8A6AE');
    doc.text('🦋 Airi\'s Collection - Inventario', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor('#111111');
    doc.text(`Fecha: ${fecha}`, 14, 28);
    doc.text(`Total de productos: ${productosArray.length}`, 14, 33);

    // Tabla
    const tableColumn = ['ID', 'Nombre', 'Categoría', 'Precio', 'Stock', 'Disponible', 'Destacado', 'Promoción'];
    const tableRows = productosArray.map(p => [
      p.id,
      p.nombre,
      p.categoria,
      p.precio,
      p.stock || 0,
      p.disponible ? '✅ Sí' : '❌ No',
      p.destacado ? '⭐ Sí' : 'No',
      p.en_promocion ? '🏷️ Sí' : 'No',
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'striped',
      headStyles: {
        fillColor: '#E8A6AE',
        textColor: '#FFFFFF',
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 8,
      },
      columnStyles: {
        0: { cellWidth: 15 },  // ID
        1: { cellWidth: 50 },  // Nombre
        2: { cellWidth: 35 },  // Categoría
        3: { cellWidth: 25 },  // Precio
        4: { cellWidth: 20 },  // Stock
        5: { cellWidth: 25 },  // Disponible
        6: { cellWidth: 25 },  // Destacado
        7: { cellWidth: 25 },  // Promoción
      },
      margin: { left: 10, right: 10 },
    });

    // Pie de página
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor('#999999');
      doc.text(
        `Airi's Collection - ${fecha}`,
        14,
        doc.internal.pageSize.height - 10
      );
    }

    const nombreArchivo = `inventario-airis-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(nombreArchivo);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    router.push('/admin');
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

  if (error) {
    return (
      <>
        <Header />
        <main style={{
          minHeight: 'calc(100vh - 10rem)',
          backgroundColor: '#F6F0EA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '2rem',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.1rem', color: '#F44336', textAlign: 'center' }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              borderRadius: '9999px',
              backgroundColor: '#E8A6AE',
              padding: '0.6rem 1.5rem',
              border: 'none',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            Reintentar
          </button>
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
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <h1 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '2.5rem',
                color: '#111111',
                marginBottom: '0.25rem',
              }}>
                🛠️ Panel de Administración
              </h1>
              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.9rem',
                color: '#111111',
                opacity: 0.6,
              }}>
                Bienvenido, {admin.usuario}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {/* 🔥 BOTÓN EXPORTAR EXCEL */}
              <button
                onClick={exportarExcel}
                style={{
                  borderRadius: '9999px',
                  backgroundColor: '#217346',
                  padding: '0.6rem 1.2rem',
                  border: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1A5C38'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#217346'}
              >
                📊 Descargar Excel
              </button>

              {/* 🔥 BOTÓN EXPORTAR PDF */}
              <button
                onClick={exportarPDF}
                style={{
                  borderRadius: '9999px',
                  backgroundColor: '#E53935',
                  padding: '0.6rem 1.2rem',
                  border: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C62828'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E53935'}
              >
                📄 Descargar PDF
              </button>

              <button
                onClick={handleLogout}
                style={{
                  borderRadius: '9999px',
                  backgroundColor: '#F44336',
                  padding: '0.6rem 1.2rem',
                  border: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D32F2F'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F44336'}
              >
                Cerrar sesión
              </button>
            </div>
          </div>

          {/* Tarjetas de estadísticas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}>
            <a
              href="/admin/productos?filtro=todos"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                textDecoration: 'none',
                color: '#111111',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
                display: 'block',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
              <h3 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '1.8rem',
                fontWeight: '700',
                color: '#111111',
              }}>
                {totalProductos}
              </h3>
              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.85rem',
                color: '#111111',
                opacity: 0.6,
              }}>
                Total productos
              </p>
            </a>

            <a
              href="/admin/productos?filtro=disponibles"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                textDecoration: 'none',
                color: '#111111',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
                display: 'block',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
              <h3 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '1.8rem',
                fontWeight: '700',
                color: '#4CAF50',
              }}>
                {disponibles}
              </h3>
              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.85rem',
                color: '#111111',
                opacity: 0.6,
              }}>
                Disponibles
              </p>
            </a>

            <a
              href="/admin/productos?filtro=agotados"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                textDecoration: 'none',
                color: '#111111',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
                display: 'block',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>❌</div>
              <h3 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '1.8rem',
                fontWeight: '700',
                color: '#F44336',
              }}>
                {agotados}
              </h3>
              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.85rem',
                color: '#111111',
                opacity: 0.6,
              }}>
                Agotados
              </p>
            </a>

            <a
              href="/admin/productos?filtro=destacados"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                textDecoration: 'none',
                color: '#111111',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
                display: 'block',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
              <h3 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '1.8rem',
                fontWeight: '700',
                color: '#C9A45C',
              }}>
                {destacados}
              </h3>
              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.85rem',
                color: '#111111',
                opacity: 0.6,
              }}>
                Destacados
              </p>
            </a>
          </div>

          {/* Alertas de inventario */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <h3 style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '1.1rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
            }}>
              📊 Alertas de inventario
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
            }}>
              <a
                href="/admin/productos?filtro=agotados"
                style={{
                  backgroundColor: '#FFEBEE',
                  borderRadius: '12px',
                  padding: '1rem',
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: '#111111',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  cursor: 'pointer',
                  display: 'block',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '2rem' }}>❌</div>
                <p style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#F44336',
                  margin: 0,
                }}>
                  {productosAgotados.length}
                </p>
                <p style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.8rem',
                  color: '#111111',
                  opacity: 0.6,
                  margin: 0,
                }}>
                  Productos agotados
                </p>
              </a>

              <a
                href="/admin/productos?filtro=stockbajo"
                style={{
                  backgroundColor: '#FFF3E0',
                  borderRadius: '12px',
                  padding: '1rem',
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: '#111111',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  cursor: 'pointer',
                  display: 'block',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '2rem' }}>⚠️</div>
                <p style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#FF9800',
                  margin: 0,
                }}>
                  {productosStockBajo.length}
                </p>
                <p style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.8rem',
                  color: '#111111',
                  opacity: 0.6,
                  margin: 0,
                }}>
                  Stock bajo
                </p>
              </a>

              <a
                href="/admin/productos?filtro=promocion"
                style={{
                  backgroundColor: '#E8F5E9',
                  borderRadius: '12px',
                  padding: '1rem',
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: '#111111',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  cursor: 'pointer',
                  display: 'block',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '2rem' }}>🏷️</div>
                <p style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#4CAF50',
                  margin: 0,
                }}>
                  {productosEnPromocion.length}
                </p>
                <p style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.8rem',
                  color: '#111111',
                  opacity: 0.6,
                  margin: 0,
                }}>
                  En promoción
                </p>
              </a>

              <a
                href="/admin/productos?filtro=stocknormal"
                style={{
                  backgroundColor: '#E3F2FD',
                  borderRadius: '12px',
                  padding: '1rem',
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: '#111111',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  cursor: 'pointer',
                  display: 'block',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '2rem' }}>✅</div>
                <p style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#2196F3',
                  margin: 0,
                }}>
                  {productosStockNormal.length}
                </p>
                <p style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.8rem',
                  color: '#111111',
                  opacity: 0.6,
                  margin: 0,
                }}>
                  Stock normal
                </p>
              </a>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            <a
              href="/admin/productos"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
                textDecoration: 'none',
                color: '#111111',
                transition: 'transform 0.3s, box-shadow 0.3s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid rgba(232, 166, 174, 0.15)',
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
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
              <h3 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '1rem',
                fontWeight: '600',
              }}>
                Gestionar Productos
              </h3>
              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.8rem',
                color: '#111111',
                opacity: 0.5,
              }}>
                Ver, agregar, editar o eliminar
              </p>
            </a>

            <a
              href="/admin/productos/nuevo"
              style={{
                backgroundColor: '#E8A6AE',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
                textDecoration: 'none',
                color: '#FFFFFF',
                transition: 'transform 0.3s, box-shadow 0.3s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(232, 166, 174, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>➕</div>
              <h3 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '1rem',
                fontWeight: '600',
              }}>
                Agregar Producto
              </h3>
              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.8rem',
                opacity: 0.8,
              }}>
                Crear un nuevo producto
              </p>
            </a>

            <a
              href="/admin/categorias"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
                textDecoration: 'none',
                color: '#111111',
                transition: 'transform 0.3s, box-shadow 0.3s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid rgba(232, 166, 174, 0.15)',
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
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📂</div>
              <h3 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '1rem',
                fontWeight: '600',
              }}>
                Gestionar Categorías
              </h3>
              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.8rem',
                color: '#111111',
                opacity: 0.5,
              }}>
                Agregar o eliminar categorías y subcategorías
              </p>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}