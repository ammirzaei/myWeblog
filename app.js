
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const dotEnv = require('dotenv');
const morgan = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const debug = require('debug')('weblog');

const connectDB = require('./config/db');
const { setStatics } = require('./utils/statics');
const winston = require('./config/winston');

// config env
dotEnv.config({ path: './config/config.env' });

// Database Connection
connectDB();

// passport Configuration
require('./config/passport');

// initialize app
const app = new express();

// Morgan Logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('combined', {
        stream: winston.stream
    }));
}

// config body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session
app.use(session({
    secret: 'secret',
    // cookie: {
    //     maxAge: null
    // },
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }) // remember me
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash()); // req.flash

// View engine
app.use(expressLayout); // use Layouts
app.set('view engine', 'ejs');
app.set('views', 'views');
app.set('layout', './layouts/mainLayout');

// Static
setStatics(app);

// Routes
app.use('/dashboard', require('./routes/dashboardRoute'));
app.use(require('./routes/userRoute'));
app.use('/', require('./routes/homeRoute'));

// app Run
app.listen(process.env.PORT, () => {
    debug(`app is Running in ${process.env.NODE_ENV}`)
});