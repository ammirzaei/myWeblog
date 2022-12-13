const path = require('path');

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const dotEnv = require('dotenv');
const morgan = require('morgan');

const connectDB = require('./config/db');
const homeRoutes = require('./routes/home');
const dashboardRoutes = require('./routes/dashboard');
const {setStatics} = require('./utils/statics');

// config env
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
app.use(expressLayout   ); // use Layouts
app.set('view engine', 'ejs');
app.set('views', 'views');
app.set('layout','./layouts/mainLayout');

// Static
setStatics(app);

// Routes
app.use(homeRoutes);
app.use('/dashboard',dashboardRoutes)

// app Run
app.listen(process.env.PORT, () => { console.log(`app is Running in ${process.env.NODE_ENV}.`) });