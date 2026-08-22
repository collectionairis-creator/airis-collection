// src/app/api/upload/route.js
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const tipo = formData.get('tipo') || 'productos';

    if (!file) {
      return Response.json({ error: 'No se envió ninguna imagen' }, { status: 400 });
    }

    // Obtener el nombre y extensión
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const originalName = file.name;
    const extension = originalName.split('.').pop();
    const nombreUnico = `${randomUUID()}.${extension}`;

    // Crear carpeta si no existe
    const uploadDir = path.join(process.cwd(), 'public/uploads', tipo);
    await mkdir(uploadDir, { recursive: true });

    // Guardar el archivo
    const filePath = path.join(uploadDir, nombreUnico);
    await writeFile(filePath, buffer);

    // Devolver la URL de la imagen
    const imageUrl = `/uploads/${tipo}/${nombreUnico}`;
    return Response.json({ success: true, url: imageUrl });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}