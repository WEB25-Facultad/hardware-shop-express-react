const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// 1. Inicializar la conexión a la base de datos (se creará el archivo si no existe)
const dbPath = path.join(__dirname, 'ecommerce.db');
const db = new Database(dbPath);

// 2. Cargar el script de inicialización (schema.sql)
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

// 3. Ejecutar los comandos para crear las tablas si no existen
// db.exec() es ideal para ejecutar múltiples sentencias SQL (como un schema entero)
db.exec(schema);

console.log('Base de datos SQLite inicializada correctamente.');

// Exportar la conexión para que los módulos de servicios la utilicen
module.exports = db;
