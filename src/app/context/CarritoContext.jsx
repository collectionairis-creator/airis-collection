// src/context/CarritoContext.js
"use client";

import { createContext, useState, useContext, useEffect } from 'react';

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [contador, setContador] = useState(0);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      try {
        setCarrito(JSON.parse(carritoGuardado));
      } catch (e) {
        console.error('Error al cargar carrito:', e);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    calcularTotalYContador();
  }, [carrito]);

  const calcularTotalYContador = () => {
    let totalCarrito = 0;
    let contadorItems = 0;
    
    carrito.forEach(item => {
      const precioLimpio = item.precio?.replace(/[^0-9.]/g, '') || '0';
      const precioNum = parseFloat(precioLimpio) || 0;
      totalCarrito += precioNum * item.cantidad;
      contadorItems += item.cantidad;
    });
    
    setTotal(totalCarrito);
    setContador(contadorItems);
  };

  const formatearPrecio = (precio) => {
    const precioLimpio = precio?.toString().replace(/[^0-9.]/g, '') || '0';
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL',
    }).format(parseFloat(precioLimpio) || 0);
  };

  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito(prevCarrito => {
      const existe = prevCarrito.find(item => item.id === producto.id);
      if (existe) {
        return prevCarrito.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...prevCarrito, { ...producto, cantidad }];
    });
  };

  const quitarDelCarrito = (id) => {
    setCarrito(prevCarrito => prevCarrito.filter(item => item.id !== id));
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      quitarDelCarrito(id);
      return;
    }
    setCarrito(prevCarrito =>
      prevCarrito.map(item =>
        item.id === id ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const abrirWhatsApp = () => {
    if (carrito.length === 0) return;
    
    let mensaje = '🛍️ *Pedido Airi\'s Collection*%0A%0A';
    carrito.forEach((item, index) => {
      const precioLimpio = item.precio?.replace(/[^0-9.]/g, '') || '0';
      const subtotal = (parseFloat(precioLimpio) || 0) * item.cantidad;
      mensaje += `${index + 1}. *${item.nombre}* x${item.cantidad} = ${formatearPrecio(subtotal.toString())}%0A`;
    });
    mensaje += `%0A*Total: ${formatearPrecio(total.toString())}*%0A%0A`;
    mensaje += '📦 *Datos de entrega:*%0A';
    mensaje += 'Nombre: %0A';
    mensaje += 'Dirección: %0A';
    mensaje += 'Teléfono: %0A';
    mensaje += '%0A🙏 ¡Gracias por tu compra!';

    const url = `https://wa.me/50488633658?text=${mensaje}`;
    window.open(url, '_blank');
  };

  return (
    <CarritoContext.Provider value={{
      carrito,
      total,
      contador,
      agregarAlCarrito,
      quitarDelCarrito,
      actualizarCantidad,
      vaciarCarrito,
      formatearPrecio,
      abrirWhatsApp,
    }}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de un CarritoProvider');
  }
  return context;
}