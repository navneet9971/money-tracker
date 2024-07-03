const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose'); 
const Transaction = require('./models/Transaction.js');
const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
    res.json({ body: 'text thik hai' });
});

// Transaction route
app.post('/api/transaction', async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const { name, price, description, datetime } = req.body;
        const transaction = await Transaction.create({ name, price, description, datetime });
        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/transactions', async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const transactions = await Transaction.find();

    res.json(transactions);
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
