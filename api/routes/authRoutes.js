const express = require('express');
const Auth = require('../models/Auths');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secretKey = 'secretKey';
const router = express.Router();

// Sign In Route
router.post('/signin', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password
        const user = await Auth.create({ firstName, lastName, email, password }); // Saving hashedPassword instead of password
        console.log('User created:', user);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});


// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.log('Email or password not provided');
        return res.status(400).json({ error: 'Email and password are required' });
    }

    console.log('Login request received:', email, password);
    try {
        const user = await Auth.findOne({ email });
        if (!user) {
            console.log(`User not found for email: ${email}`);
            return res.status(404).json({ error: 'User not found' });
        }
        // Compare the provided password with the hashed password from the database
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password comparison result: ${isMatch}`);

        if (!isMatch) {
            console.log(`Invalid password for user: ${email}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: '1h' });
        console.log('Token generated:', token);
        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Profile Route
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const authData = jwt.verify(req.token, secretKey);
        const user = await Auth.findById(authData.id).select('firstName lastName email');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'Profile access granted',
            user
        });
    } catch (err) {
        console.error('Error fetching user profile:', err.message);
        res.status(403).json({ error: 'Invalid token' });
    }
});

// Token Verification Middleware
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        req.token = token;
        next();
    } else {
        res.status(403).json({ error: 'No token provided' });
    }
}

module.exports = router;
