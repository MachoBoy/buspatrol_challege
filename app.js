const express = require('express');
const livereload = require('livereload');
const livereloadMiddleware = require('connect-livereload');
const path = require('path');
const index_router = require('./routes/index');
const movies_router = require('./routes/movies');

// configure live server
const liveServer = livereload.createServer({
  // set extentions
  exts: ['html', 'css', 'ejs'],
  debug: true,
});

liveServer.watch(__dirname);

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// live reload middleware
app.use(livereloadMiddleware());

app.use('/', index_router);
app.use('/movies', movies_router);

module.exports = app;
