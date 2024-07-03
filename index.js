const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan');

require('dotenv').config();
require('./utils/db');

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002','https://itp-movie-frontend.vercel.app'],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.json());

// Logging Middleware
const myMiddleware = (req, res, next) => {
    console.log('This is my middleware:', req.originalUrl);
    next();
};
app.use(myMiddleware);

// Routes
app.use('/user', require('./routes/user'));
app.use('/image', require('./routes/imageUploadRoutes'));
app.use('/movie', require('./routes/movie'));
app.use('/screen', require('./routes/screen'));
app.use('/food', require('./routes/food'));
app.use('/booking', require('./routes/booking'));
app.use('/offer', require('./routes/offer'));
app.use('/payment', require('./routes/payment'));
app.use('/feedback', require('./routes/feedback'));
app.use('/up',require('./routes/upcoming'));
app.use('/', require('./routes/employee'));
app.use('/slip', require('./routes/slip'));


app.get('/', (req, res) => {
    res.json({ message: 'The API is working' });
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
