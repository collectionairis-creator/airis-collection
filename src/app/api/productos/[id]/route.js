// src/app/api/productos/[id]/route.js
import db from '@/lib/db';

// GET - Obtener un producto por ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const producto = db.prepare('SELECT * FROM productos WHERE id = ?').get(id);
    
    if (!producto) {
      return Response.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    
    return Response.json(producto);
  } catch (error) {
    console.error('Error GET /api/productos/[id]:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Actualizar un producto
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
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
      UPDATE productos SET
        nombre = ?, categoria = ?, subcategoria = ?, marca = ?, precio = ?, precioNum = ?,
        precio_original = ?, descuento = ?, en_promocion = ?, stock = ?, stock_minimo = ?, orden = ?,
        descripcion = ?, emoji = ?, disponible = ?, destacado = ?,
        imagenPrincipal = ?, imagen2 = ?, imagen3 = ?, imagen4 = ?
      WHERE id = ?
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
      imagen4 || '',
      id
    );

    if (result.changes === 0) {
      return Response.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error PUT /api/productos/[id]:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Eliminar un producto
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const stmt = db.prepare('DELETE FROM productos WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return Response.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error DELETE /api/productos/[id]:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}