const express = require('express');
const Transaction = require('../models/Transaction'); // Adjust the path if necessary
const Auth = require('../models/Auths'); // Adjust the path if necessary
const jwt = require("jsonwebtoken");
const router = express.Router();
const secretKey = "secretKey";

// Middleware to verify the token
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

// Route to create a new transaction
router.post('/transaction', verifyToken, async (req, res) => {
    jwt.verify(req.token, secretKey, async (err, authData) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        try {
            const { name, price, description, datetime } = req.body;
            const transaction = await Transaction.create({ name, price, description, datetime, userId: authData.id });
            res.json(transaction);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

// Route to get all transactions for the logged-in user along with user data
router.get('/transactions', verifyToken, async (req, res) => {
    jwt.verify(req.token, secretKey, async (err, authData) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        try {
            const transactions = await Transaction.find({ userId: authData.id });
            const user = await Auth.findById(authData.id).select('firstName lastName email');

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({
                message: 'Transactions and user data retrieved successfully',
                user,
                transactions
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

module.exports = router;
