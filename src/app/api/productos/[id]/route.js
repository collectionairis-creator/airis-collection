// src/app/api/productos/[id]/route.js
import { supabase } from '@/lib/supabase';

// GET - Obtener un producto por ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { data: producto, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

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

    const { data, error } = await supabase
      .from('productos')
      .update({
        nombre,
        categoria,
        subcategoria: subcategoria || '',
        marca: marca || '',
        precio,
        precioNum: precioNum || 0,
        precio_original: precio_original || '',
        descuento: descuento || 0,
        en_promocion: en_promocion || 0,
        stock: stock || 0,
        stock_minimo: stock_minimo || 5,
        orden: orden || 0,
        descripcion: descripcion || '',
        emoji: emoji || '🧴',
        disponible: disponible ? 1 : 0,
        destacado: destacado ? 1 : 0,
        imagenPrincipal: imagenPrincipal || '',
        imagen2: imagen2 || '',
        imagen3: imagen3 || '',
        imagen4: imagen4 || '',
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
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
    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error DELETE /api/productos/[id]:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}