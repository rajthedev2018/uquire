// Project          : UQuire 
// File             : ~/Documents/WebDev/UQuire/routes/editAppRole.js
// Description      : Routes to add and remove Job Roles in App Role
// Author           : Rajas Gupta
// Date Created     : July 31st, 2019
// Data Modified    : August 5th, 2019

var express     = require("express"); // Import Express Framework
var JobRole     = require("../models/jobRole.js"); // Import Job Role model
var AppRole     = require("../models/appRole.js"); // Import App Role model
var editAppRole = express.Router({mergeParams: true}); // Set Job Role routes

// Job Role Add Route
editAppRole.post("/", function(req, res){
    AppRole.findById(req.params.approle_id, function(err, appRole){
        if(err) return console.log("Error occured in finding App Role");
        JobRole.findById(req.body.jobRole_id, function(err, jobRole){
            if(err) return console.log("Error occured in finding Job Role");
            appRole.jobRoles.push(jobRole);
            appRole.save();
            return res.redirect("./");
        });
    });
});

// Job Role Add Form Route
editAppRole.get("/add", function(req, res){
    JobRole.find(function(err, allJobRoles){
        if(err || !allJobRoles) return console.log("Error occured in getting Job Roles");
        return res.render("appRole/add.ejs", {jobRoles: allJobRoles});
    });
});

// Job Role Remove Route
editAppRole.delete("/:jobrole_id", function(req, res){
    AppRole.findById(req.params.approle_id, function(err, appRole){
        if(err) return console.log("Error occured in finding app role");
        var index = appRole.jobRoles.indexOf(req.params.jobrole_id);
        if (index > -1) appRole.jobRoles.splice(index, 1);
        appRole.save();
        return res.redirect("/applications/" + req.params.application_id + "/approles/" + req.params.approle_id);
    });
});

// Job Role Remove Form Route
editAppRole.get("/:jobrole_id/remove", function(req, res){
    AppRole.findById(req.params.approle_id, function(err, foundAppRole){
        if(err) return console.log("Error occured in finding app role");
        return res.render("appRole/remove.ejs", {appRole: foundAppRole});
    });
});

module.exports = editAppRole; // Export routes to parent (./appRole.js)