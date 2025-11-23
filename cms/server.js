// Get dependencies
var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// import the routing file to handle the default (index) route
var index = require('./server/routes/app');

// Import routing files for resources
var documents = require('./server/routes/documents');
var messages = require('./server/routes/messages');
var contacts = require('./server/routes/contacts');

var app = express(); // create an instance of express

// Tell express to use the following parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use(logger('dev')); // Tell express to use the Morgan logger

// Add support for CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

// Tell express to use the specified directory as the
// root directory for your web site. The Angular build
// may put the final `index.html` under `dist/cms/browser`.
const staticDir = path.join(__dirname, 'dist', 'cms', 'browser');
app.use(express.static(staticDir));

// Tell express to map the default route ('/') to the index route
app.use('/', index);

// Map URL routes to resource routing files
app.use('/api/documents', documents);
app.use('/api/messages', messages);
app.use('/api/contacts', contacts);

// Tell express to map all other non-defined routes back to the index page
// Use a RegExp route to avoid path parsing issues with some path-to-regexp versions
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

// Define the port address and tell express to use this port
const port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Tell the server to start listening on the provided port
server.listen(port, function() {
  console.log('API running on localhost: ' + port)
});
