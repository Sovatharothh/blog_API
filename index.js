const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/data/connect');
const userRoutes = require('./src/routes/userRoute'); 


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware

// Routes
app.use('/api/v1/users', userRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
});

// Connect to MongoDB
connectDB()
    .then(() => {
        // Start the server after successful connection
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB Connection Error:', error.message);
        process.exit(1); // Exit process with failure
    });
