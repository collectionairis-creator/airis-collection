// src/app/api/categorias/route.js
import db from '@/lib/db';

// GET - Obtener todas las categorías con sus subcategorías
export async function GET() {
  try {
    const categorias = db.prepare(`
      SELECT c.*, 
        json_group_array(
          json_object('id', s.id, 'nombre', s.nombre)
        ) as subcategorias
      FROM categorias c
      LEFT JOIN subcategorias s ON s.categoria_id = c.id
      GROUP BY c.id
      ORDER BY c.id DESC
    `).all();

    const resultado = categorias.map(c => {
      let subcategorias = [];
      let subcategorias_ids = [];
      
      if (c.subcategorias) {
        try {
          const parsed = JSON.parse(c.subcategorias);
          // Filtrar el primer elemento que puede ser null
          const filtered = parsed.filter(s => s !== null);
          subcategorias = filtered.map(s => s.nombre);
          subcategorias_ids = filtered.map(s => s.id);
        } catch (e) {
          subcategorias = [];
          subcategorias_ids = [];
        }
      }
      
      return {
        ...c,
        subcategorias,
        subcategorias_ids
      };
    });

    return Response.json(resultado);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// POST - Crear una nueva categoría
export async function POST(request) {
  try {
    const { nombre } = await request.json();
    
    if (!nombre || nombre.trim() === '') {
      return Response.json({ error: 'El nombre es requerido' }, { status: 400 });
    }

    const stmt = db.prepare('INSERT INTO categorias (nombre) VALUES (?)');
    const result = stmt.run(nombre.trim());

    return Response.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      return Response.json({ error: 'Esta categoría ya existe' }, { status: 400 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Eliminar una categoría
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    // Las subcategorías se eliminan automáticamente por ON DELETE CASCADE
    const stmt = db.prepare('DELETE FROM categorias WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return Response.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}