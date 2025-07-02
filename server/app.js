// get packages
var fs = require("fs")
var path = require("path")
var express = require('express')
require('dotenv').config()

//////////////
var mongoose = require("mongoose");
const bodyParser = require("body-parser");
const yourCollection="UserUnknown"
const dbSchema = new mongoose.Schema({}, {
  strict: false,
  collection: yourCollection // bind schema to specific collection
});
const dbModel = mongoose.model(yourCollection, dbSchema);
mongoose.connect(process.env.MONGODB_URI);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function callback() {
  console.log("database opened");
});
//////////////

// --- INSTANTIATE THE APP
var app = express();

app.use(bodyParser.json());

// manage cors policy

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

app.get('/', function (request, response) {
  response.render('welcome.html');
});

app.post('/postData', (req, res) => {
  dbModel.create(req.body)
  res.json({status: "OK"})
});


// set view engigne
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// START THE SERVER
app.listen(3000, function () {
  console.log("Server running. To see the experiment that it is serving, visit the following address:");
  console.log("http://localhost:%d/expNOW", 3000);
});

