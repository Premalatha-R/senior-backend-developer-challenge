const express = require('express');
const config = require('./config/config');
const transferRoutes = require('./routes/transferRoutes');
const { connectDB } = require('./models/dbConnect');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/bank', transferRoutes);

// Connect to MongoDB
connectDB();

// Start the server
app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});

