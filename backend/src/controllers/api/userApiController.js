const db = require('../../../db/database');

const userApiController = {
    getUsers: (req, res) => {
        try {
            const stmt = db.prepare('SELECT id, name, email, role, status FROM users');
            const users = stmt.all().map(user => {
                const initials = user.name
                    ? user.name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    : 'US';
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role || 'Cliente',
                    status: user.status || 'Activo',
                    initials: initials
                };
            });
            res.json(users);
        } catch (error) {
            console.error('Error in API getUsers:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getUserById: (req, res) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }
            const user = db.prepare('SELECT id, name, email, role, status, created_at FROM users WHERE id = ?').get(id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            // Format joined date (e.g., '2026-07-30 18:17:40' to '30/07/2026')
            // Aquí el backend convierte esa fecha a un formato humano y amigable (DD/MM/YYYY) 
            // antes de mandarlo a React.
            let joined = 'Hoy';
            if (user.created_at) {
                const dateObj = new Date(user.created_at);
                if (!isNaN(dateObj.getTime())) {
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const year = dateObj.getFullYear();
                    joined = `${day}/${month}/${year}`;
                }
            }

            const initials = user.name
                ? user.name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2)
                : 'US';

            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role || 'Cliente',
                status: user.status || 'Activo',
                initials: initials,
                joined: joined
            });
        } catch (error) {
            console.error('Error in API getUserById:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateUser: (req, res) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }
            const { role, status } = req.body;
            
            const stmt = db.prepare('UPDATE users SET role = ?, status = ? WHERE id = ?');
            const result = stmt.run(role, status, id);
            
            if (result.changes === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ success: true, message: 'User updated successfully' });
        } catch (error) {
            console.error('Error in API updateUser:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteUser: (req, res) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }
            const stmt = db.prepare('DELETE FROM users WHERE id = ?');
            const result = stmt.run(id);
            if (result.changes === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ success: true, message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error in API deleteUser:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Método para registrar usuarios desde el Dashboard de administración en React
    createUser: (req, res) => {
        try {
            const { name, email, role, status, password } = req.body;
            
            // Validaciones básicas del cuerpo de la petición
            if (!name || !email) {
                return res.status(400).json({ error: 'Name and email are required' });
            }

            const crypto = require('crypto');
            // Ciframos la contraseña usando SHA-256 (igual que en el flujo de registro EJS)
            const passwordHash = crypto.createHash('sha256').update(password || '12345678').digest('hex');
            
            // Insertamos el nuevo usuario en la base de datos relacional SQLite
            const stmt = db.prepare('INSERT INTO users (name, email, role, status, password_hash) VALUES (?, ?, ?, ?, ?)');
            const result = stmt.run(name, email, role || 'Cliente', status || 'Activo', passwordHash);
            
            res.status(201).json({ success: true, id: result.lastInsertRowid });
        } catch (error) {
            console.error('Error in API createUser:', error);
            if (error.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'El email ya está registrado' });
            }
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

module.exports = userApiController;
