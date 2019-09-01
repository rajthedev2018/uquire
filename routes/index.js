// Project          : UQuire 
// File             : ~/Documents/WebDev/UQuire/routes/index.js
// Description:     : Home route file. Root of all routes
// Author           : Rajas Gupta
// Date Created     : July 24th, 2019
// Data Modified    : August 2nd, 2019

var express = require("express"); // Import Express Framework
var index = express.Router({mergeParams: true}); // Set Index Routes

// Get child routes
var jobRoleRoutes = require("./jobRole.js");
var applicationRoutes = require("./application.js");

// Home Route
index.get("/", function(req, res){
    res.render("index/home.ejs");
});

// Use child routes
index.use("/jobroles", jobRoleRoutes);
index.use("/applications", applicationRoutes);

module.exports = index; // Export routes to app.js