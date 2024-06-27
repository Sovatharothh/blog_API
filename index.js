const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/data/connect');
const userRoute = require('./src/routes/userRoute'); 
const blogRoute = require('./src/routes/blogRoute');
const uploadRoute = require('./src/routes/uploadRoute');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/v1/users', userRoute);
app.use('/api/v1/blogs', blogRoute);
app.use('/api/v1/upload', uploadRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
});

// Catch all unhandled routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
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
        process.exit(1); 
    });
