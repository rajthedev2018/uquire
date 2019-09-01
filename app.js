// Project          : UQuire 
// File             : ~/Documents/WebDev/UQuire/app.js
// Description      : Root file. Run node here
// Author           : Rajas Gupta
// Date Created     : July 24th, 2019
// Data Modified    : August 2nd, 2019

// Import NPM Libraries
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride  = require("method-override");

var indexRoutes = require("./routes/index.js"); // Get routes

var seed = require("./seed/seed.js"); // Get Seed file

var app = express(); // Use Express Framework

// Connect to MongoDB Uquire Databases
mongoose.set("useFindAndModify", false);
mongoose.connect("mongodb://localhost:27017/uquire", {useNewUrlParser : true});

// App Settings
app.use(bodyParser.urlencoded({extended : true})); // Include req.params in body
app.use(express.static(__dirname + "/public")); // Use public Directory
app.use(methodOverride("_method")); // PUT and DELETE Methods

app.use("/", indexRoutes); // Use routes

seed(); // Seed databases

// Set root to localhost::3000
app.listen(3000, function(){
    return console.log("Server is running!");
});