// src/app/api/categorias/[id]/route.js
import { supabase } from '@/lib/supabase';

// PUT - Actualizar una categoría
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nombre } = body;

    const { data, error } = await supabase
      .from('categorias')
      .update({ nombre })
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return Response.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error PUT /api/categorias/[id]:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Eliminar una categoría por ID
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Primero eliminar subcategorías relacionadas
    const { error: errorSub } = await supabase
      .from('subcategorias')
      .delete()
      .eq('categoria_id', id);

    if (errorSub) throw errorSub;

    // Luego eliminar la categoría
    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error DELETE /api/categorias/[id]:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}