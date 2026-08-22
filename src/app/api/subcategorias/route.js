// src/app/api/subcategorias/route.js
import db from '@/lib/db';

// POST - Crear una nueva subcategoría
export async function POST(request) {
  try {
    const { nombre, categoria_id } = await request.json();
    
    if (!nombre || nombre.trim() === '') {
      return Response.json({ error: 'El nombre es requerido' }, { status: 400 });
    }

    if (!categoria_id) {
      return Response.json({ error: 'La categoría es requerida' }, { status: 400 });
    }

    // Verificar que la categoría existe
    const categoriaExiste = db.prepare('SELECT id FROM categorias WHERE id = ?').get(categoria_id);
    if (!categoriaExiste) {
      return Response.json({ error: 'La categoría no existe' }, { status: 400 });
    }

    const stmt = db.prepare('INSERT INTO subcategorias (nombre, categoria_id) VALUES (?, ?)');
    const result = stmt.run(nombre.trim(), categoria_id);

    return Response.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Eliminar una subcategoría
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const stmt = db.prepare('DELETE FROM subcategorias WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return Response.json({ error: 'Subcategoría no encontrada' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}