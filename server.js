const express = require('express');
const dotEnv = require('dotenv');
const fileUpload = require('express-fileupload');

const connectDB = require('./config/db');
const { setRoutes } = require('./utils/routes');
const { errorHandler } = require('./middlewares/error');
const { setHeaders } = require('./middlewares/header');
const path = require('path');
const rootDir = require('./utils/rootDir');

// config env
dotEnv.config({ path: './config/config.env' });


// Database Connection
connectDB();

// initialize app
const app = new express();

// use static
app.use(express.static(path.join(rootDir, 'public')));

// config body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(setHeaders);

// use express-fileUpload
app.use(fileUpload());  // req.files

// Routes
setRoutes(app);

// Error Handler
app.use(errorHandler);

// app Run
app.listen(process.env.PORT, () => {
    console.log(`app is Running in ${process.env.NODE_ENV}`)
});