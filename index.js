const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const router = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');

const app = express();

// Database connection
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected successfully!');
});

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://82.112.226.134/app1',
    'https://vectorinstruments.netlify.app'
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());
app.use('/api', router);
app.use('/app1/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(errorHandler);

const port = process.env.APP_PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
