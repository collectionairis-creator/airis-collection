// src/app/api/categorias/route.js
import { supabase } from '@/lib/supabase';

// GET - Obtener todas las categorías con sus subcategorías
export async function GET() {
  try {
    // Obtener categorías
    const { data: categorias, error: errorCategorias } = await supabase
      .from('categorias')
      .select('*')
      .order('id', { ascending: true });

    if (errorCategorias) throw errorCategorias;

    // Obtener subcategorías
    const { data: subcategorias, error: errorSubcategorias } = await supabase
      .from('subcategorias')
      .select('*')
      .order('id', { ascending: true });

    if (errorSubcategorias) throw errorSubcategorias;

    // Combinar categorías con sus subcategorías
    const resultado = categorias.map(cat => ({
      ...cat,
      subcategorias: subcategorias
        .filter(sub => sub.categoria_id === cat.id)
        .map(sub => sub.nombre)
    }));

    return Response.json(resultado);
  } catch (error) {
    console.error('Error GET /api/categorias:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// POST - Crear una nueva categoría
export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre } = body;

    const { data, error } = await supabase
      .from('categorias')
      .insert([{ nombre }])
      .select();

    if (error) throw error;

    return Response.json({ success: true, id: data?.[0]?.id });
  } catch (error) {
    console.error('Error POST /api/categorias:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Eliminar una categoría
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'ID de categoría requerido' }, { status: 400 });
    }

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
    console.error('Error DELETE /api/categorias:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}