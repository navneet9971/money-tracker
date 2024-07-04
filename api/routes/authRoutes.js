const express = require('express');
const Auth = require('../models/Auths'); // Adjust the path if necessary
const router = express.Router();
const jwt = express();

// Auth route
router.post('/auth', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const user = await Auth.create({ firstName, lastName, email, password });
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

module.exports = router;
