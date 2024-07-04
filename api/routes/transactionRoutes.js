// transactionRoutes.js
const express = require('express');
const Transaction = require('../models/Transaction'); // Adjust the path if necessary
const router = express.Router();

// Transaction routes
router.post('/transaction', async (req, res) => {
    try {
        const { name, price, description, datetime } = req.body;
        const transaction = await Transaction.create({ name, price, description, datetime });
        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
