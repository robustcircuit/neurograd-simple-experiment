// get packages
var fs = require("fs");
var path = require("path");
var express = require("express");
var cors = require("cors");
var mongoose = require("mongoose");

require("dotenv").config();

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

// --- INSTANTIATE THE APP
var app = express();

// manage cors policy
app.use(cors());

app.use(express.static(__dirname + "/public/"));

// set views
app.set("views", path.join(__dirname, "/public/"));

// set routes
app.get("/expNOW", function (request, response) {
  response.render("experiment.html");
});

// set routes
app.get("/visual_search", function (request, response) {
  response.render("visual_search.html");
});


//[SOLUTION: receive data on the server]
var bodyparser = require("body-parser");
app.use(bodyparser.json({ limit: "50mb" }));
app.post("/save-file", function (request, response) {
  var datestr = new Date();
  datestr = String(datestr.toISOString()).replace(/:|\s+|_/g, '')
  var filename = String(request.body[request.body.length - 1].basename + "_" + datestr + ".json");
  fs.writeFileSync(path.join(__dirname, "logdata/" + filename), JSON.stringify(request.body), (err) => {if (err) throw err; response.end(); });
});

// set view engigne
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// START THE SERVER
app.listen(3000, function () {
  console.log(
    "Server running. To see the experiment that it is serving, visit the following address:"
  );
  console.log("http://localhost:%d/expNOW", 3000);
});
