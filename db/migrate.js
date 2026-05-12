const fs = require('fs');
const path = require('path');
const db = require('./database');

// 1. Leer el archivo products.json de manera síncrona usando el módulo fs
const productsPath = path.join(__dirname, '..', 'products.json');
const productsData = fs.readFileSync(productsPath, 'utf-8');
const products = JSON.parse(productsData);

// 2. Preparar la sentencia SQL utilizando INSERT OR IGNORE para evitar duplicados
const insertProductStmt = db.prepare(`
    INSERT OR IGNORE INTO products 
    (id, name, price, description, image, category, mostRequested, stock)
    VALUES (@id, @name, @price, @description, @image, @category, @mostRequested, @stock)
`);

// Opcional: También preparamos la inserción para la tabla categories
const insertCategoryStmt = db.prepare(`
    INSERT OR IGNORE INTO categories (name) VALUES (@category)
`);

// 3. Crear una transacción síncrona para insertar todos los productos de forma masiva y eficiente
const runMigration = db.transaction((productos) => {
    let insertados = 0;

    for (const prod of productos) {
        // Insertar la categoría si existe
        if (prod.category) {
            insertCategoryStmt.run({ category: prod.category });
        }
        
        // Insertar el producto mapeando las propiedades
        const result = insertProductStmt.run({
            id: prod.id,
            name: prod.name,
            price: prod.price,
            description: prod.description || '',
            image: prod.image || '',
            category: prod.category || '',
            mostRequested: prod.mostRequested ? 1 : 0, // SQLite no usa booleanos nativos (true=1, false=0)
            stock: prod.stock !== undefined ? prod.stock : 0
        });

        // Sumar solo si el registro fue realmente insertado (ignora duplicados gracias a INSERT OR IGNORE)
        insertados += result.changes;
    }

    return insertados;
});

// 4. Ejecutar la migración
try {
    console.log('🔄 Iniciando la migración de datos desde products.json...');
    const cantidadInsertada = runMigration(products);
    
    console.log(`✅ Migración completada exitosamente.`);
    console.log(`📦 Nuevos productos insertados: ${cantidadInsertada}`);
    if (cantidadInsertada === 0) {
        console.log(`⚠️  (Los productos ya existían en la base de datos).`);
    }
} catch (error) {
    console.error('❌ Ha ocurrido un error durante la migración:', error.message);
} finally {
    // 5. Cierre de Conexión
    db.close();
    console.log('🔌 Conexión a la base de datos cerrada de manera segura.');
}
