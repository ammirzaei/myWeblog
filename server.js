
const express = require('express');
const dotEnv = require('dotenv');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const fileUpload = require('express-fileupload');

const connectDB = require('./config/db');
const { setRoutes } = require('./utils/routes');
const {errorHandler} = require('./middlewares/error');

// config env
dotEnv.config({ path: './config/config.env' });

// Database Connection
connectDB();

// passport Configuration
require('./config/passport');

// initialize app
const app = new express();

// config body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// use express-fileUpload
app.use(fileUpload());  // req.files

// Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    // cookie: {
    //     maxAge: null
    // },
    resave: false,
    unset : 'destroy',
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }) // remember me
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash()); // req.flash

// Routes
setRoutes(app);

// Error Handler
app.use(errorHandler);

// app Run
app.listen(process.env.PORT, () => {
    console.log(`app is Running in ${process.env.NODE_ENV}`)
});