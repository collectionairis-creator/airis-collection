// src/app/api/productos/route.js
import db from '@/lib/db';

// GET - Obtener todos los productos
export async function GET() {
  try {
    const productos = db.prepare('SELECT * FROM productos ORDER BY orden ASC, id DESC').all();
    return Response.json(productos);
  } catch (error) {
    console.error('Error GET /api/productos:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// POST - Crear un nuevo producto
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      nombre,
      categoria,
      subcategoria,
      marca,
      precio,
      precioNum,
      precio_original,
      descuento,
      en_promocion,
      stock,
      stock_minimo,
      orden,
      descripcion,
      emoji,
      disponible,
      destacado,
      imagenPrincipal,
      imagen2,
      imagen3,
      imagen4,
    } = body;

    const stmt = db.prepare(`
      INSERT INTO productos (
        nombre, categoria, subcategoria, marca, precio, precioNum,
        precio_original, descuento, en_promocion, stock, stock_minimo, orden,
        descripcion, emoji, disponible, destacado,
        imagenPrincipal, imagen2, imagen3, imagen4
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      nombre,
      categoria,
      subcategoria || '',
      marca || '',
      precio,
      precioNum || 0,
      precio_original || '',
      descuento || 0,
      en_promocion || 0,
      stock || 0,
      stock_minimo || 5,
      orden || 0,
      descripcion || '',
      emoji || '🧴',
      disponible ? 1 : 0,
      destacado ? 1 : 0,
      imagenPrincipal || '',
      imagen2 || '',
      imagen3 || '',
      imagen4 || ''
    );

    return Response.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error POST /api/productos:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}