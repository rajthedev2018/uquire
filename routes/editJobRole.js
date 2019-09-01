// Project          : UQuire 
// File             : ~/Documents/WebDev/UQuire/routes/editJobRole.js
// Description      : Routes to add and remove App Roles in Job Role
// Author           : Rajas Gupta
// Date Created     : July 31st, 2019
// Data Modified    : August 5th, 2019

var express     = require("express"); // Import Express Framework
var JobRole     = require("../models/jobRole.js"); // Import Job Role model
var Application = require("../models/application.js"); // Import Application model
var AppRole     = require("../models/appRole.js"); // Import App Role model
var editJobRole = express.Router({mergeParams: true}); // Set Job Role routes

// Appplication Find Route
editJobRole.post("/", function(req, res){
    return res.redirect(req.body.application_id + "/approles/add");
});

// Application Choose Route
editJobRole.get("/choose", function(req, res){
    Application.find(function(err, allApplications){
        if(err || !allApplications) return console.log("Error occured in finding Applications");
        return res.render("jobRole/choose.ejs", {applications: allApplications});
    });
});

// App Role Add Route
editJobRole.post("/:application_id/approles", function(req, res){
    AppRole.findById(req.body.approle_id, function(err, foundAppRole){
        if(err || !foundAppRole) return console.log("Error occured in finding App Role");
        JobRole.findById(req.params.jobrole_id, function(err, foundJobRole){
            if(err || !foundJobRole) return console.log("Error occured in finding Job Role");
            foundAppRole.jobRoles.push(foundJobRole);
            foundAppRole.save();
            foundJobRole.appRoles.push(foundAppRole);
            foundJobRole.save();
            return res.redirect("/jobroles/" + foundJobRole._id);
        });
    });
});

// App Role Choose Route
editJobRole.get("/:application_id/approles/add", function(req, res){
    Application.findById(req.params.application_id)
    .populate("appRoles", "name")
    .exec(function(err, foundApplication){
        if(err || !foundApplication) return console.log("Error occured in finding Application");
        return res.render("jobRole/add.ejs", {application: foundApplication});
    });
});

// App Role Delete Route
editJobRole.delete("/:application_id/approles/:approle_id", function(req, res){
    JobRole.findById(req.params.jobrole_id)
    .populate({path: "appRoles", select: "jobRoles"})
    .exec(function(err, foundJobRole){
        if(err || !foundJobRole) return console.log("Error occurred in finding Job Role")
        foundJobRole.appRoles.forEach(function(appRole){
            var index = appRole.jobRoles.indexOf(req.params.jobrole_id);
            if(index > -1) appRole.jobRoles.splice(index, 1);
            appRole.save();
        });
        var index = foundJobRole.appRoles.map(function(x){return x._id}).indexOf(req.params.approle_id);
        if(index > -1) foundJobRole.appRoles.splice(index, 1);
        foundJobRole.save();
        return res.redirect("/jobroles/" + foundJobRole._id);
    });
});

// App Role Remove Form Route
editJobRole.get("/:application_id/approles/:approle_id/remove", function(req, res){
    JobRole.findById(req.params.jobrole_id)
    .populate({
        path: "appRoles", match: {_id: req.params.approle_id}, select: "name application",
        populate: {path: "application", select: "name"}
    }).exec(function(err, foundJobRole){
        if(err || !foundJobRole) return console.log("Error occured in finding job role");
        return res.render("jobRole/remove.ejs", {jobRole: foundJobRole});
    });
});

module.exports = editJobRole; // Export routes to parent (./jobRole.js)