import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise'; // Use the promise version of mysql2
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'; // Use secure secret

app.use(cors());
app.use(express.json());

// MySQL database connection
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'wings',
});

// User Registration (Sign Up)
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [results] = await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully', userId: results.insertId });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const [results] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (results.length === 0) return res.status(401).json({ message: 'Invalid username or password' });

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, user: { id: user.id, username: user.username } });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Middleware for authenticating JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.user = user;
        next();
    });
};

// New API Endpoint to Check Session
app.get('/api/check-session', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

// API Routes for Products
app.get('/api/products', authenticateToken, async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM products');
        res.json(results);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

// Add a new product
app.post('/api/products', authenticateToken, async (req, res) => {
    const { name, description, category, price, quantity } = req.body;

    if (!name || !description || !category || !price || !quantity) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const [results] = await db.query(
            'INSERT INTO products (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)',
            [name, description, category, price, quantity]
        );
        res.json({ id: results.insertId, name, description, category, price, quantity });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Error adding product', error: error.message });
    }
});

// Update a product
app.put('/api/products/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, description, category, price, quantity } = req.body;

    if (!name || !description || !category || !price || !quantity) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const [results] = await db.query(
            'UPDATE products SET name = ?, description = ?, category = ?, price = ?, quantity = ? WHERE id = ?',
            [name, description, category, price, quantity, id]
        );
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
        res.json({ id, name, description, category, price, quantity });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});

// Sell a product (reduce quantity by 1)
app.put('/api/products/sell/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const [results] = await db.query('SELECT quantity FROM products WHERE id = ?', [id]);
        if (results.length === 0) return res.status(404).json({ message: 'Product not found' });

        let quantity = results[0].quantity;
        if (quantity > 0) {
            quantity -= 1;
            await db.query('UPDATE products SET quantity = ? WHERE id = ?', [quantity, id]);
            res.json({ id, quantity });
        } else {
            res.status(400).json({ message: 'Product is out of stock!' });
        }
    } catch (error) {
        console.error('Error selling product:', error);
        res.status(500).json({ message: 'Error selling product', error: error.message });
    }
});

// Delete a product
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const [results] = await db.query('DELETE FROM products WHERE id = ?', [id]);
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});