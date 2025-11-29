// Get dependencies
var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

// import the routing file to handle the default (index) route
var index = require('./server/routes/app');

// Import routing files for resources
var documents = require('./server/routes/documents');
var messages = require('./server/routes/messages');
var contacts = require('./server/routes/contacts');

var app = express(); // create an instance of express

// Simple request logger for debugging (method, url, body)
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    console.log('[REQUEST BODY]', JSON.stringify(req.body));
  }
  next();
});

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
app.use('/documents', documents);
app.use('/messages', messages);
app.use('/contacts', contacts);

// Establish a connection to the MongoDB database
// Use the SRV connection string from Atlas Drivers section (not the direct connection URL)
const mongoUrl = EnterUrOwn

// Connect without unsupported legacy options (Mongoose handles modern defaults internally)
// If the host string is a non-SRV Atlas host (mongodb://...) it may require specifying all hosts
// Use the SRV form (mongodb+srv://...) provided by Atlas when possible.
const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB Atlas!');
  } catch (err) {
    console.log('Connection failed: ' + err);
    if (err && err.message && err.message.includes('No addresses found at host')) {
      console.log('Hint: the provided connection string may require the SRV scheme.');
      console.log('Try using a connection string that starts with "mongodb+srv://<user>:<pw>@..." from Atlas Connect dialog.');
    }
  }
};

connectToMongo();

// Mongoose connection events for better diagnostics
mongoose.connection.on('connected', () => console.log('Mongoose event: connected'));
mongoose.connection.on('error', (err) => console.log('Mongoose event: error', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose event: disconnected'));
mongoose.connection.on('reconnected', () => console.log('Mongoose event: reconnected'));

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
