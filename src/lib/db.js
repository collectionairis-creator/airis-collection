// lib/db.js
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'airis.db');
const db = new Database(dbPath);

// 🔥 TABLA CON TODAS LAS COLUMNAS
db.exec(`
  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL,
    subcategoria TEXT,
    marca TEXT,
    precio TEXT NOT NULL,
    precioNum REAL,
    precio_original TEXT,
    descuento INTEGER DEFAULT 0,
    en_promocion INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 5,
    orden INTEGER DEFAULT 0,
    descripcion TEXT,
    emoji TEXT,
    disponible INTEGER DEFAULT 1,
    destacado INTEGER DEFAULT 0,
    imagenPrincipal TEXT,
    imagen2 TEXT,
    imagen3 TEXT,
    imagen4 TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Crear tabla de categorías
db.exec(`
  CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Crear tabla de subcategorías
db.exec(`
  CREATE TABLE IF NOT EXISTS subcategorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    categoria_id INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
  )
`);

// Insertar categorías
const categoriasIniciales = [
  'Bath & Body Works',
  "Victoria's Secret",
  'Cuidado Personal',
  'Moda',
  'Accesorios',
  'Perfumería'
];

const insertCategoria = db.prepare('INSERT OR IGNORE INTO categorias (nombre) VALUES (?)');
categoriasIniciales.forEach(nombre => {
  insertCategoria.run(nombre);
});

// Insertar subcategorías
const subcategoriasIniciales = [
  { categoria: 'Bath & Body Works', nombre: "Men's Shop" },
  { categoria: 'Bath & Body Works', nombre: 'Set de regalos' },
  { categoria: 'Bath & Body Works', nombre: 'Splash' },
  { categoria: 'Bath & Body Works', nombre: 'Cremas' },
  { categoria: 'Bath & Body Works', nombre: 'Hogar y Velas' },
  { categoria: 'Bath & Body Works', nombre: 'Jabones y antibacteriales' },
  { categoria: "Victoria's Secret", nombre: 'Splash' },
  { categoria: "Victoria's Secret", nombre: 'Cremas' },
  { categoria: "Victoria's Secret", nombre: 'Pantys' },
  { categoria: 'Cuidado Personal', nombre: 'Cremas' },
  { categoria: 'Cuidado Personal', nombre: 'Exfoliantes' },
  { categoria: 'Cuidado Personal', nombre: 'Limpieza corporal' },
  { categoria: 'Moda', nombre: 'Dama' },
  { categoria: 'Moda', nombre: 'Caballero' },
  { categoria: 'Perfumería', nombre: 'Perfumes para dama' },
  { categoria: 'Perfumería', nombre: 'Perfumes para caballero' },
];

const insertSubcategoria = db.prepare(`
  INSERT OR IGNORE INTO subcategorias (nombre, categoria_id)
  SELECT ?, id FROM categorias WHERE nombre = ?
`);

subcategoriasIniciales.forEach(({ categoria, nombre }) => {
  if (nombre) {
    insertSubcategoria.run(nombre, categoria);
  }
});

console.log('✅ Base de datos SQLite conectada');
console.log('📂 Categorías y subcategorías insertadas');
console.log('📦 Tabla de productos con TODAS las columnas');

export default db;