const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');  //Nos ayudan a encontrar y leer archivos (modulos nativos de Node.js)

// 1. Inicializar la conexión a la base de datos (se creará el archivo si no existe)
// EXPLICACIÓN: Usamos 'better-sqlite3' por ser muy rápido y sincrónico. Al iniciar el servidor, 
// este bloque busca el archivo de base de datos local 'ecommerce.db'; si no existe, lo crea automáticamente.
const dbPath = path.join(__dirname, 'ecommerce.db');
const db = new Database(dbPath);

// 2. Cargar el script de inicialización (schema.sql)
// EXPLICACIÓN: Luego lee un archivo 'schema.sql' y ejecuta su contenido para construir 
// todas las tablas necesarias (usuarios, productos, etc.) en caso de que la base esté vacía.
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

// 3. Ejecutar los comandos para crear las tablas si no existen
db.exec(schema);

// Migraciones de esquema
try {
    db.exec("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'Cliente'");
} catch (e) {}
try {
    db.exec("ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'Activo'");
} catch (e) {}

console.log('Base de datos SQLite inicializada correctamente.');

// Exportar la conexión para que los módulos de servicios la utilicen
// Convertimos este archivo en un "Singleton" basicamente para cuando services haga (require) 
// usen la misma conexion a la bd y no crear nuevas en cada services, asi ahorramos memoria
module.exports = db;