// src/app/api/productos/route.js
import { supabase } from '@/lib/supabase';

// GET - Obtener todos los productos
export async function GET() {
  try {
    const { data: productos, error } = await supabase
      .from('productos')
      .select('*')
      .order('orden', { ascending: true })
      .order('id', { ascending: false });

    if (error) throw error;

    return Response.json(productos || []);
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

    const { data, error } = await supabase
      .from('productos')
      .insert([
        {
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
        },
      ])
      .select();

    if (error) throw error;

    return Response.json({ success: true, id: data?.[0]?.id });
  } catch (error) {
    console.error('Error POST /api/productos:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}