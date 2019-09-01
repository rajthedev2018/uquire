// Project          : UQuire 
// File             : ~/Documents/WebDev/UQuire/routes/jobRole.js
// Description:     : REST routes for Job Role
// Author           : Rajas Gupta
// Date Created     : July 24th, 2019
// Data Modified    : August 5th, 2019

var express             = require("express"); // Import Express Framework
var editJobRoleRoutes   = require("./editJobRole.js"); // Get child routes
var JobRole             = require("../models/jobRole.js"); // Import Job Role model
var jobRole             = express.Router({mergeParams: true}); // Set Job Role routes

// Job Role Index Route
jobRole.get("/", function(req, res){
    JobRole.find(function(err, allJobRoles){
        if(err || !allJobRoles) return console.log("Error occurred in finding Job Roles");
        res.render("jobRole/index.ejs", {jobRoles: allJobRoles});
    });
});

// Job Role Create Route
jobRole.post("/", function(req, res){
    JobRole.create(req.body.jobRole, function(err, newJobRole){
        if(err || !newJobRole) return console.log("Error occurred in creating Job Role");
        res.redirect("/jobroles");
    });
});

// Job Role New Form Route
jobRole.get("/new", function(req, res){
    res.render("jobRole/new.ejs")
});

// Job Role Show Route
jobRole.get("/:jobRole_id", function(req, res){
    JobRole.findById(req.params.jobRole_id)
    .populate({
            path: "appRoles", select: "name application", 
            populate:{path: "application", select:"name"}
    }).exec(function(err, foundJobRole){
        if(err || !foundJobRole) return console.log("Error occurred in finding Job Role");
        res.render("jobRole/show.ejs", {jobRole: foundJobRole});
    });
});

// Job Role Update Route
jobRole.put("/:jobRole_id", function(req, res){
    JobRole.findByIdAndUpdate(req.params.jobRole_id, req.body.jobRole)
    .exec(function(err, updatedJobRole){
        if(err || !updatedJobRole) return console.log("Error occurred in updating Job Role");
        res.redirect("/jobroles");
    });
});

// Jobe Role Edit Form Route
jobRole.get("/:jobRole_id/edit", function(req, res){
    JobRole.findById(req.params.jobRole_id, function(err, foundJobRole){
        if(err || !foundJobRole) return console.log("Error occurred in finding Job Role");
        res.render("jobRole/edit.ejs", {jobRole: foundJobRole});
    });
});

// Job Role Remove Route
jobRole.delete("/:jobRole_id", function(req, res){
    JobRole.findById(req.params.jobRole_id)
    .populate("appRoles", "jobRoles")
    .exec(function(err, foundJobRole){
        if(err || !foundJobRole) return console.log("Error occurred in finding Job Role");
        foundJobRole.appRoles.forEach(function(appRole){
            var index = appRole.jobRoles.indexOf(foundJobRole._id);
            if (index > -1) appRole.jobRoles.splice(index, 1);
            appRole.save();
        });
        JobRole.deleteMany(foundJobRole, function(err){
            if(err) return console.log("Error occurred in deleting Job Role");
            res.redirect("/jobroles");
        });
    });
});

// JobRole Delete Form Route
jobRole.get("/:jobRole_id/delete", function(req, res){
    JobRole.findById(req.params.jobRole_id, function(err, foundJobRole){
        if(err || !foundJobRole) return console.log("Error occurred in finding Job Role");
        res.render("jobRole/delete.ejs", {jobRole: foundJobRole});
    });
});

jobRole.use("/:jobrole_id/applications", editJobRoleRoutes); // Use child routes

module.exports = jobRole; // Export routes to parent (./index.js)