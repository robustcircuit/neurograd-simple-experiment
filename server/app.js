// get packages
var fs = require("fs");
var path = require("path");
var express = require("express");
var cors = require("cors");
var mongoose = require("mongoose");

require("dotenv").config();

const yourCollection="UserUnknown"
const dbSchema = new mongoose.Schema({
  trials: {
    type: Array,
    required: true
  }
}, {
  collection: yourCollection
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

app.post("/save-file", async (req, res) => {
    try {
        await dbModel.create({
            trials: req.body
        });
        res.status(200).send({ message: "success" });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
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
