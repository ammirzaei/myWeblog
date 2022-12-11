const path = require('path');

const express = require('express');

const homeRoutes = require('./routes/home');

const app = new express();

// View engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Static
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(homeRoutes);

// app Run
app.listen(3000, () => { console.log('app is Running.') });