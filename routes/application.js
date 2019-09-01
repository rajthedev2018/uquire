// Project          : UQuire 
// File             : ~/Documents/WebDev/UQuire/routes/application.js
// Description      : REST routes for Application
// Author           : Rajas Gupta
// Date Created     : July 24th, 2019
// Data Modified    : August 5th, 2019

var express         = require("express"); // Import Express Framework
var appRoleRoutes   = require("./appRole.js"); // Get child routes
var Application     = require("../models/application.js"); // Import Application model
var AppRole         = require("../models/appRole.js"); // Import App Role model
var application     = express.Router({mergeParams: true}); // Set Application routes

// Application Index Route
application.get("/", function(req, res){
    Application.find(function(err, allApplications){
        if(err || !allApplications) return console.log("Error occured in finding Applications");
        return res.render("application/index.ejs", {applications: allApplications});
    });
});

// Application Create Route
application.post("/", function(req, res){
    Application.create(req.body.application, function(err, newApplication){
        if(err) return console.log("Error occured in creating application");
        return res.redirect("/applications");
    });
});

// Application New Form Route
application.get("/new", function(req, res){
    return res.render("application/new.ejs")
});

// Application Show Route
application.get("/:application_id", function(req, res){
    Application.findById(req.params.application_id)
    .populate("appRoles", "name")
    .exec(function(err, foundApplication){
        if(err || !foundApplication) return console.log("Error occured in finding Application");
        return res.render("application/show.ejs", {application: foundApplication});
    });
});

// Application Update Route
application.put("/:application_id", function(req, res){
    Application.findByIdAndUpdate(req.params.application_id, req.body.application)
    .exec(function(err, updatedApplication){
        if(err || !updatedApplication) return console.log("Error occured in updating application");
        return res.redirect("/applications");
    });
});

// Application Edit Form Route
application.get("/:application_id/edit", function(req, res){
    Application.findById(req.params.application_id, function(err, foundApplication){
        if(err || !foundApplication) return console.log("Error occured in finding Application");
        return res.render("application/edit.ejs", {application: foundApplication});
    });
});

// Application Remove Route
application.delete("/:application_id", function(req, res){
    Application.findById(req.params.application_id)
    .populate({
        path: "appRoles", select: "jobRoles",
        populate: {path: "jobRoles", select: "appRoles"}
    }).exec(function(err, foundApplication){
        if(err || !foundApplication) console.log("Error occured in finding Application");
        foundApplication.appRoles.forEach(function(appRole){
            appRole.jobRoles.forEach(function(jobRole){
                var index = jobRole.appRoles.indexOf(appRole._id);
                if(index > -1) jobRole.appRoles.splice(index, 1);
                jobRole.save();
            });
            AppRole.deleteMany(appRole, function(err){
                if(err) return console.log("Error occurred in deleting App Role");
            });
        });
        Application.deleteMany(foundApplication, function(err){
            if(err) return console.log("Error occurred in deleting Application");
            return res.redirect("/applications");
        });
    });
});

// Application Delete Form Route
application.get("/:application_id/delete", function(req, res){
    Application.findById(req.params.application_id, function(err, foundApplication){
        if(err) return console.log("Error occured in finding application");
        return res.render("application/delete.ejs", {application: foundApplication});
    });
});

application.use("/:application_id/approles", appRoleRoutes); // Use child routes

module.exports = application; // Export routes to parent (./index.js)