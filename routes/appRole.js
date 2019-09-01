// Project          : UQuire 
// File             : ~/Documents/WebDev/UQuire/routes/appRole.js
// Description      : REST routes for App Role
// Author           : Rajas Gupta
// Date Created     : July 24th, 2019
// Data Modified    : August 5th, 2019

var express             = require("express"); // Import Express Framework
var editAppRoleRoutes   = require("./editAppRole.js"); // Get child routes
var Application         = require("../models/application.js"); // Import Application model
var AppRole             = require("../models/appRole.js"); // Import App Role model
var appRole             = express.Router({mergeParams: true});  // Set App Role routes

// App Role Create Route
appRole.post("/", function(req, res){
    AppRole.create(req.body.appRole, function(err, newAppRole){
        if(err || !newAppRole) return console.log("Error occurred in creating App Role");
        Application.findById(newAppRole.application, function(err, foundApplication){
            if(err || !foundApplication) return console.log("Error occurred in finding Application");
            foundApplication.appRoles.push(newAppRole);
            foundApplication.save();
            return res.redirect("/applications/" + newAppRole.application._id);
        });
    });
});

// App Roles New Form Route
appRole.get("/new", function(req, res){
    Application.findById(req.params.application_id, function(err, foundApplication){
        if(err || !foundApplication) return console.log("Error occured in  Find Application!");
        return res.render("appRole/new.ejs", {application: foundApplication});
    });
});

//AppRoles Show Route
appRole.get("/:approle_id", function(req, res){
    AppRole.findById(req.params.approle_id)
    .populate({path: "jobRoles application", select: "name"})
    .exec(function(err, foundAppRole){
        if(err || !foundAppRole) return console.log("Error occured in finding appRole");
        return res.render("appRole/show.ejs", {appRole: foundAppRole});
    });
});

//AppRole Update Route
appRole.put("/:approle_id", function(req, res){
    AppRole.findByIdAndUpdate(req.params.approle_id, req.body.appRole)
    .exec(function(err, updatedAppRole){
        if(err || !updatedAppRole) return console.log("Error occured in updating App Role");
        return res.redirect("./");
    });
});

//AppRole Edit Form Route
appRole.get("/:approle_id/edit", function(req, res){
    AppRole.findById(req.params.approle_id, function(err, foundAppRole){
        if(err || !foundAppRole) return console.log("Error occured in finding app role");
        return res.render("appRole/edit.ejs", {appRole: foundAppRole});
    });
});

//App Role Remove Route
appRole.delete("/:approle_id", function(req, res){
    AppRole.findById(req.params.approle_id)
    .populate({path: "jobRoles application", select: "appRoles"})
    .exec(function(err, foundAppRole){
        if(err) return console.log("Error occured in findng App Role");
        foundAppRole.jobRoles.forEach(function(jobRole){
            var index = jobRole.appRoles.indexOf(foundAppRole._id);
            if(index > -1) jobRole.appRoles.splice(index, 1);
            jobRole.save();
        });
        var index = foundAppRole.application.appRoles.indexOf(foundAppRole._id);
        if(index > -1) foundAppRole.application.appRoles.splice(index, 1);
        foundAppRole.application.save();
        AppRole.deleteMany(foundAppRole, function(err){
            if(err) return console.log("Error occured in deleting app role");
            return res.redirect("/applications/" + req.params.application_id);
        });
    });
});

//App Role Delete Form Route
appRole.get("/:approle_id/delete", function(req, res){
    AppRole.findById(req.params.approle_id, function(err, appRole){
        if(err) return console.log("Error occured in finding app role");
        return res.render("appRole/delete.ejs", {appRole: appRole});
    });
});

appRole.use("/:appRole_id/jobroles", editAppRoleRoutes); // Use child routes

module.exports = appRole; // Export routes to parent (./application.js)