const path = require('path');

const express = require('express');
const dotEnv = require('dotenv');
const morgan = require('morgan');

const connectDB = require('./config/db');
const homeRoutes = require('./routes/home');

// congif env
dotEnv.config({ path: './config/config.env' });

// Database Connection
connectDB();

// initialize app
const app = new express();

// Logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// View engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Static
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(homeRoutes);

// app Run
app.listen(process.env.PORT, () => { console.log(`app is Running in ${process.env.NODE_ENV}.`) });