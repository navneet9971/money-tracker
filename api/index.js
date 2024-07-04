const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const transactionRoutes = require('./routes/transactionRoutes'); 
const authRoutes = require('./routes/authRoutes'); 
const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB once when the server starts
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    });

// Test route
app.get('/api/test', (req, res) => {
    res.json({ body: 'text thik hai' });
});

// Use the routes
app.use('/api', transactionRoutes);
app.use('/api', authRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
