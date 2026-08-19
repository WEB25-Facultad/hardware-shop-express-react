// NO debe saber si usamos SQLite, MySQL o JSON. Su único trabajo es pedirle datos al servicio.
const categoryService = require('../../services/categoryService');

const categoryApiController = {
    // GET /api/categories
    list: (req, res) => {
        try {
            const categories = categoryService.findAll(); //Como esto es una API, usamos res.json() en lugar de res.render().
            res.json(categories);                         //por que nuestro backend pasa el array de JS a formato JSON.
        } catch (error) {
            console.error('Error in API list categories:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // GET /api/categories/:id
    detail: (req, res) => {
        try {
            const category = categoryService.findById(req.normalizedId); //un middleware anterior ya validó que el ID sea un número válido
            res.json(category);                                          
        } catch (error) {
            console.error('Error in API detail category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // POST /api/categories
    create: (req, res) => {
        try {
            let { name } = req.body;

            if (!name || name.trim() === '') {
                return res.status(400).json({ error: 'El nombre de la categoría es requerido' });
            }

            const newCategory = categoryService.create({ name: name.trim() });
            res.status(201).json(newCategory);
        } catch (error) {
            console.error('Error in API create category:', error);
            // Catch SQLite UNIQUE constraint error
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                return res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
            }
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // PUT /api/categories/:id
    update: (req, res) => {
        try {
            let { name } = req.body;

            if (!name || name.trim() === '') {
                return res.status(400).json({ error: 'El nombre de la categoría es requerido' });
            }

            const updatedCategory = categoryService.update(req.normalizedId, { name: name.trim() });
            res.json(updatedCategory);
        } catch (error) {
            console.error('Error in API update category:', error);
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                return res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
            }
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // DELETE /api/categories/:id
    delete: (req, res) => {
        try {
            categoryService.delete(req.normalizedId);
            res.json({ success: true, message: 'Categoría eliminada correctamente' });
        } catch (error) {
            console.error('Error in API delete category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

module.exports = categoryApiController;
