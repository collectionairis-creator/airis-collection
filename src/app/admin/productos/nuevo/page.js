// src/app/admin/productos/nuevo/page.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function AdminNuevoProducto() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [imagenSubiendo, setImagenSubiendo] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);
  
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    subcategoria: '',
    marca: '',
    precio_original: '',
    descuento: '',
    en_promocion: false,
    stock: '',
    stock_minimo: '5',
    orden: '',
    descripcion: '',
    emoji: '🧴',
    disponible: true,
    destacado: false,
    imagenPrincipal: '',
    imagen2: '',
    imagen3: '',
    imagen4: '',
  });

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        setCargandoCategorias(true);
        const res = await fetch('/api/categorias');
        const data = await res.json();
        setCategorias(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, categoria: data[0].id.toString() }));
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      } finally {
        setCargandoCategorias(false);
      }
    };
    cargarCategorias();
  }, []);

  useEffect(() => {
    if (formData.categoria) {
      const categoriaSeleccionada = categorias.find(c => c.id.toString() === formData.categoria);
      if (categoriaSeleccionada) {
        const subcategoriasUnicas = [...new Set(categoriaSeleccionada.subcategorias || [])];
        setSubcategorias(subcategoriasUnicas);
        setFormData(prev => ({ ...prev, subcategoria: '' }));
      }
    }
  }, [formData.categoria, categorias]);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubirImagen = async (e, campo) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMensaje('❌ El archivo debe ser una imagen');
      return;
    }

    setImagenSubiendo(true);
    setMensaje('📤 Subiendo imagen...');

    try {
      const formDataImg = new FormData();
      formDataImg.append('file', file);
      formDataImg.append('tipo', 'productos');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataImg,
      });

      const data = await res.json();
      if (data.success) {
        setFormData({
          ...formData,
          [campo]: data.url,
        });
        setMensaje(`✅ Imagen subida correctamente`);
        setTimeout(() => setMensaje(''), 3000);
      } else {
        setMensaje('❌ Error al subir imagen');
      }
    } catch (error) {
      setMensaje('❌ Error al subir imagen');
    } finally {
      setImagenSubiendo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');

    try {
      const precioOriginalLimpio = formData.precio_original.replace(/[^0-9.]/g, '');
      const precioOriginal = parseFloat(precioOriginalLimpio) || 0;
      const descuento = parseInt(formData.descuento) || 0;
      
      let precioFinal = precioOriginal;
      if (descuento > 0 && precioOriginal > 0) {
        precioFinal = precioOriginal * (1 - descuento / 100);
      }
      
      const precioFinalFormateado = precioFinal.toFixed(2);
      const precioNum = parseFloat(precioFinalFormateado);
      const precioMostrar = descuento > 0 ? precioFinalFormateado : precioOriginal;

      const categoriaNombre = categorias.find(c => c.id.toString() === formData.categoria)?.nombre || '';

      const productoData = {
        nombre: formData.nombre,
        categoria: categoriaNombre,
        subcategoria: formData.subcategoria || '',
        marca: formData.marca || '',
        precio: precioMostrar,
        precioNum: precioNum,
        precio_original: precioOriginal > 0 ? precioOriginal.toString() : '',
        descuento: descuento,
        en_promocion: formData.en_promocion ? 1 : 0,
        stock: parseInt(formData.stock) || 0,
        stock_minimo: parseInt(formData.stock_minimo) || 5,
        orden: parseInt(formData.orden) || 0,
        descripcion: formData.descripcion || '',
        emoji: formData.emoji || '🧴',
        disponible: formData.disponible ? 1 : 0,
        destacado: formData.destacado ? 1 : 0,
        imagenPrincipal: formData.imagenPrincipal || '',
        imagen2: formData.imagen2 || '',
        imagen3: formData.imagen3 || '',
        imagen4: formData.imagen4 || '',
      };

      const res = await fetch('/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productoData),
      });

      const data = await res.json();
      if (data.success) {
        setMensaje('✅ Producto agregado correctamente');
        setTimeout(() => {
          router.push('/admin/productos');
        }, 1500);
      } else {
        setMensaje('❌ Error al agregar producto: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('❌ Error al conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  if (!admin || cargandoCategorias) {
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
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '2.5rem',
              color: '#111111',
            }}>
              ➕ Agregar Producto
            </h1>
            <a
              href="/admin/productos"
              style={{
                borderRadius: '9999px',
                backgroundColor: '#E8A6AE',
                padding: '0.6rem 1.5rem',
                border: 'none',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#FFFFFF',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D4959B'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E8A6AE'}
            >
              ← Volver
            </a>
          </div>

          {mensaje && (
            <p style={{
              padding: '0.8rem 1rem',
              borderRadius: '12px',
              backgroundColor: mensaje.includes('✅') ? '#E8F5E9' : '#FFEBEE',
              color: mensaje.includes('✅') ? '#2E7D32' : '#C62828',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
            }}>
              {mensaje}
            </p>
          )}

          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
              }}>
                <div>
                  <label style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    display: 'block',
                    marginBottom: '0.3rem',
                  }}>
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
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
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    display: 'block',
                    marginBottom: '0.3rem',
                  }}>
                    Categoría *
                  </label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
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
                    }}
                  >
                    {categorias.length === 0 ? (
                      <option value="">No hay categorías</option>
                    ) : (
                      categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    display: 'block',
                    marginBottom: '0.3rem',
                  }}>
                    Subcategoría
                  </label>
                  <select
                    name="subcategoria"
                    value={formData.subcategoria}
                    onChange={handleChange}
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
                    }}
                  >
                    <option value="">Seleccionar subcategoría</option>
                    {subcategorias.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    display: 'block',
                    marginBottom: '0.3rem',
                  }}>
                    Marca
                  </label>
                  <input
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleChange}
                    placeholder="Ej: Bath & Body Works"
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
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    display: 'block',
                    marginBottom: '0.3rem',
                  }}>
                    Precio Original *
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '2px solid #E8A6AE',
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    overflow: 'hidden',
                  }}>
                    <span style={{
                      padding: '0 0.5rem 0 1rem',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#111111',
                      opacity: 0.6,
                      userSelect: 'none',
                    }}>
                      L.
                    </span>
                    <input
                      type="number"
                      name="precio_original"
                      value={formData.precio_original}
                      onChange={handleChange}
                      placeholder="200"
                      required
                      min="0"
                      step="0.01"
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem 0.8rem 0.5rem',
                        border: 'none',
                        backgroundColor: 'transparent',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '1rem',
                        color: '#111111',
                        outline: 'none',
                        MozAppearance: 'textfield',
                      }}
                    />
                  </div>
                  <p style={{
                    fontSize: '0.7rem',
                    color: '#111111',
                    opacity: 0.4,
                    marginTop: '0.2rem',
                  }}>
                    El precio final se calculará automáticamente con el descuento
                  </p>
                </div>

                <div>
                  <label style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    display: 'block',
                    marginBottom: '0.3rem',
                  }}>
                    Descuento (%)
                  </label>
                  <input
                    type="number"
                    name="descuento"
                    value={formData.descuento}
                    onChange={handleChange}
                    placeholder="20"
                    min="0"
                    max="100"
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
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    display: 'block',
                    marginBottom: '0.3rem',
                  }}>
                    Precio Final (automático)
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '2px solid #E8A6AE',
                    borderRadius: '12px',
                    backgroundColor: '#F6F0EA',
                    overflow: 'hidden',
                    opacity: 0.7,
                  }}>
                    <span style={{
                      padding: '0 0.5rem 0 1rem',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#111111',
                      opacity: 0.6,
                      userSelect: 'none',
                    }}>
                      L.
                    </span>
                    <span style={{
                      padding: '0.8rem 1rem 0.8rem 0.5rem',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '1rem',
                      color: '#111111',
                    }}>
                      {formData.precio_original && formData.descuento ? 
                        (parseFloat(formData.precio_original) * (1 - parseInt(formData.descuento) / 100)).toFixed(2) 
                        : formData.precio_original || '0.00'}
                    </span>
                  </div>
                </div>

                <div>
                  <label style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    display: 'block',
                    marginBottom: '0.3rem',
                  }}>
                    Cantidad en stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="10"
                    min="0"
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
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    display: 'block',
                    marginBottom: '0.3rem',
                  }}>
                    Stock mínimo (alerta)
                  </label>
                  <input
                    type="number"
                    name="stock_minimo"
                    value={formData.stock_minimo}
                    onChange={handleChange}
                    placeholder="5"
                    min="0"
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
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    display: 'block',
                    marginBottom: '0.3rem',
                  }}>
                    Orden
                  </label>
                  <input
                    type="number"
                    name="orden"
                    value={formData.orden}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
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
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    display: 'block',
                    marginBottom: '0.3rem',
                  }}>
                    Emoji
                  </label>
                  <input
                    type="text"
                    name="emoji"
                    value={formData.emoji}
                    onChange={handleChange}
                    placeholder="🧴"
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
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    display: 'block',
                    marginBottom: '0.3rem',
                  }}>
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Descripción del producto..."
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
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                  <label style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                  }}>
                    <input
                      type="checkbox"
                      name="en_promocion"
                      checked={formData.en_promocion}
                      onChange={handleChange}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: '#C9A45C',
                        cursor: 'pointer',
                      }}
                    />
                    En promoción
                  </label>
                </div>

                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem' }}>
                  <h3 style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#111111',
                    marginBottom: '0.5rem',
                  }}>
                    📸 Imágenes del producto
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {[
                      { campo: 'imagenPrincipal', label: 'Imagen Principal' },
                      { campo: 'imagen2', label: 'Imagen 2' },
                      { campo: 'imagen3', label: 'Imagen 3' },
                      { campo: 'imagen4', label: 'Imagen 4' },
                    ].map((img) => (
                      <div key={img.campo}>
                        <label style={{
                          fontFamily: 'Montserrat, sans-serif',
                          fontSize: '0.85rem',
                          fontWeight: '500',
                          display: 'block',
                          marginBottom: '0.3rem',
                        }}>
                          {img.label}
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSubirImagen(e, img.campo)}
                          disabled={imagenSubiendo}
                          style={{
                            width: '100%',
                            padding: '0.6rem',
                            borderRadius: '12px',
                            border: '2px solid #E8A6AE',
                            backgroundColor: '#FFFFFF',
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '0.9rem',
                            color: '#111111',
                            outline: 'none',
                            cursor: 'pointer',
                          }}
                        />
                        {formData[img.campo] && (
                          <p style={{ fontSize: '0.7rem', color: '#4CAF50', marginTop: '0.2rem' }}>
                            ✅ {formData[img.campo].split('/').pop()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                  <label style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                  }}>
                    <input
                      type="checkbox"
                      name="disponible"
                      checked={formData.disponible}
                      onChange={handleChange}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: '#4CAF50',
                        cursor: 'pointer',
                      }}
                    />
                    Disponible
                  </label>

                  <label style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                  }}>
                    <input
                      type="checkbox"
                      name="destacado"
                      checked={formData.destacado}
                      onChange={handleChange}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: '#C9A45C',
                        cursor: 'pointer',
                      }}
                    />
                    Destacado
                  </label>
                </div>
              </div>

              <div style={{
                marginTop: '2rem',
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
              }}>
                <a
                  href="/admin/productos"
                  style={{
                    borderRadius: '9999px',
                    backgroundColor: '#E0E0E0',
                    padding: '0.8rem 2rem',
                    border: 'none',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#111111',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C0C0C0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E0E0E0'}
                >
                  Cancelar
                </a>
                <button
                  type="submit"
                  disabled={cargando}
                  style={{
                    borderRadius: '9999px',
                    backgroundColor: cargando ? '#CCCCCC' : '#4CAF50',
                    padding: '0.8rem 2rem',
                    border: 'none',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    cursor: cargando ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    if (!cargando) {
                      e.currentTarget.style.backgroundColor = '#388E3C';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!cargando) {
                      e.currentTarget.style.backgroundColor = '#4CAF50';
                    }
                  }}
                >
                  {cargando ? 'Guardando...' : '✅ Guardar producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}