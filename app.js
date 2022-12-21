
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const dotEnv = require('dotenv');
const morgan = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');

const connectDB = require('./config/db');
const { setStatics } = require('./utils/statics');

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

// config body-parser
app.use(express.urlencoded({ extended: false }));

// Session
app.use(session({
    secret: 'secret',
    cookie: {
        maxAge: 5000
    },
    resave: false,
    saveUninitialized: false
}));

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
app.listen(process.env.PORT, () => { console.log(`app is Running in ${process.env.NODE_ENV}.`) });