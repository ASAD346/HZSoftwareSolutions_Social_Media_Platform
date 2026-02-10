const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

// Signup
router.post('/signup', async (req, res) => {
    const { username, email, password, bio } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    try {
        // Check if user exists
        const { rows: existingUsers } = await db.query(
            'SELECT * FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const { rows: result } = await db.query(
            'INSERT INTO users (username, email, password_hash, bio) VALUES ($1, $2, $3, $4) RETURNING id',
            [username, email, hashedPassword, bio || '']
        );

        res.status(201).json({ message: 'User created successfully', userId: result[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const { rows: users } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = users[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Return user info (excluding password)
        const { password_hash, ...userInfo } = user;
        res.json({ message: 'Login successful', user: userInfo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
