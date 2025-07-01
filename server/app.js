// get packages
var fs = require("fs")
var path = require("path")
var express = require('express')
var cors = require('cors')
require('dotenv').config()

// --- INSTANTIATE THE APP
var app = express();

// manage cors policy
app.use(cors())

app.use(express.static(__dirname + '/public/'));

// set views
app.set('views', path.join(__dirname, '/public/'));

// set routes
app.get('/expNOW', function (request, response) {
  response.render('experiment.html');
});

app.get('/dummyRoute', function (request, response) {
  response.render('dummy.html');
});

// set view engigne
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// START THE SERVER
app.listen(3000, function () {
  console.log("Server running. To see the experiment that it is serving, visit the following address:");
  console.log("http://localhost:%d/expNOW", 3000);
});

