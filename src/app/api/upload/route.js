// src/app/api/upload/route.js
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const tipo = formData.get('tipo') || 'productos';

    if (!file) {
      return Response.json({ error: 'No se subió ningún archivo' }, { status: 400 });
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return Response.json({ error: 'El archivo debe ser una imagen' }, { status: 400 });
    }

    // Generar nombre único
    const extension = file.name.split('.').pop();
    const nombreUnico = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${extension}`;
    const ruta = `${tipo}/${nombreUnico}`;

    // Convertir archivo a buffer
    const buffer = await file.arrayBuffer();

    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from('productos')
      .upload(ruta, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Obtener URL pública
    const { data: publicUrlData } = supabase.storage
      .from('productos')
      .getPublicUrl(ruta);

    const publicUrl = publicUrlData.publicUrl;

    return Response.json({
      success: true,
      url: publicUrl,
      path: ruta,
    });
  } catch (error) {
    console.error('Error en upload:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}