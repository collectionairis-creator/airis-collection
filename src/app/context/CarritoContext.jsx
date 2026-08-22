// src/app/context/CarritoContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [contador, setContador] = useState(0);
  const [cargado, setCargado] = useState(false);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const carritoGuardado = localStorage.getItem('carrito');
      if (carritoGuardado) {
        try {
          const carritoParseado = JSON.parse(carritoGuardado);
          // Asegurar que todos los productos tengan precioNum e imagenPrincipal
          const carritoCorregido = carritoParseado.map(item => ({
            ...item,
            precioNum: parseFloat(item.precioNum) || 0,
            imagenPrincipal: item.imagenPrincipal || '',
          }));
          setCarrito(carritoCorregido);
          calcularTotales(carritoCorregido);
        } catch (error) {
          console.error('Error al cargar el carrito:', error);
        }
      }
      setCargado(true);
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (cargado && typeof window !== 'undefined') {
      localStorage.setItem('carrito', JSON.stringify(carrito));
      calcularTotales(carrito);
    }
  }, [carrito, cargado]);

  // Calcular total y contador
  const calcularTotales = (items) => {
    let nuevoTotal = 0;
    let nuevoContador = 0;
    items.forEach(item => {
      const precioNum = parseFloat(item.precioNum) || 0;
      const cantidad = parseInt(item.cantidad) || 0;
      nuevoTotal += precioNum * cantidad;
      nuevoContador += cantidad;
    });
    setTotal(nuevoTotal);
    setContador(nuevoContador);
  };

  // Agregar producto al carrito
  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito(prevCarrito => {
      const productoExistente = prevCarrito.find(item => item.id === producto.id);
      
      // Asegurar que precioNum e imagenPrincipal existan
      const precioNum = parseFloat(producto.precioNum) || 0;
      const imagenPrincipal = producto.imagenPrincipal || '';
      
      const productoConPrecio = {
        ...producto,
        precioNum: precioNum,
        imagenPrincipal: imagenPrincipal,
        cantidad: cantidad,
      };
      
      if (productoExistente) {
        return prevCarrito.map(item =>
          item.id === producto.id
            ? { 
                ...item, 
                cantidad: item.cantidad + cantidad,
                precioNum: parseFloat(item.precioNum) || 0,
                imagenPrincipal: item.imagenPrincipal || '',
              }
            : item
        );
      } else {
        return [...prevCarrito, productoConPrecio];
      }
    });
  };

  // Quitar producto del carrito
  const quitarDelCarrito = (id) => {
    setCarrito(prevCarrito => prevCarrito.filter(item => item.id !== id));
  };

  // Actualizar cantidad de un producto
  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      quitarDelCarrito(id);
      return;
    }
    setCarrito(prevCarrito =>
      prevCarrito.map(item =>
        item.id === id 
          ? { 
              ...item, 
              cantidad: nuevaCantidad,
              precioNum: parseFloat(item.precioNum) || 0,
              imagenPrincipal: item.imagenPrincipal || '',
            } 
          : item
      )
    );
  };

  // Vaciar el carrito
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // Formatear precio
  const formatearPrecio = (valor) => {
    return `L. ${valor.toFixed(2)}`;
  };

  // Generar mensaje para WhatsApp
  const generarMensajeWhatsApp = () => {
    if (carrito.length === 0) return '';

    let mensaje = '🦋 ¡Hola! Quisiera hacer un pedido en Airi\'s Collection 🦋\n\n';
    mensaje += '📦 Mi pedido:\n';
    mensaje += '─────────────────\n';
    
    carrito.forEach((item, index) => {
      const precioNum = parseFloat(item.precioNum) || 0;
      const subtotal = precioNum * (parseInt(item.cantidad) || 0);
      mensaje += `${index + 1}. ${item.nombre}\n`;
      mensaje += `   📍 Marca: ${item.marca || 'Airi\'s Collection'}\n`;
      mensaje += `   💰 Precio: ${item.precio}\n`;
      mensaje += `   🔢 Cantidad: ${item.cantidad}x\n`;
      mensaje += `   📊 Subtotal: ${formatearPrecio(subtotal)}\n\n`;
    });

    mensaje += '─────────────────\n';
    mensaje += `💰 *Total aproximado:* ${formatearPrecio(total)}\n\n`;
    mensaje += '💳 Métodos de pago disponibles:\n';
    mensaje += '   💵 Efectivo\n';
    mensaje += '   🏦 Transferencia bancaria\n\n';
    mensaje += '📌 Por favor confirmar:\n';
    mensaje += '   ✅ Disponibilidad de productos\n';
    mensaje += '   ✅ Total del pedido\n';
    mensaje += '   ✅ Método de pago\n\n';
    mensaje += '¡Espero su respuesta! 🙌';

    return mensaje;
  };

  // Abrir WhatsApp con el mensaje
  const abrirWhatsApp = () => {
    const mensaje = generarMensajeWhatsApp();
    if (!mensaje) {
      alert('El carrito está vacío');
      return;
    }
    const url = `https://wa.me/50488633658?text=${encodeURIComponent(mensaje)}`;
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
      abrirWhatsApp,
      formatearPrecio,
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