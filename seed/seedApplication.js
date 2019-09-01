// Import NPM Libraries
var mongoose = require("mongoose");
var excelToJson = require('convert-excel-to-json');
var Application = require("../models/application.js");
var JobRole = require("../models/jobRole.js");

var seedAppRole = require("./seedAppRole.js"); // Get Seed file

var data = excelToJson({
    sourceFile: './seed/appRoles.xlsx',
    sheets: ["applications"],
    header: {
        rows: 1
    },
    columnToKey:{
        A: "name",
        B: "type",
        C: "owner",
        D: "ldap_cap",
        E: "ldap_int",
        F: "customRoles",
        G: "description"
    }
});

function deleteAllApplications(){
    return new Promise(function(resolve, reject){
        Application.deleteMany(function(err){
            if(err){
                console.log("Error in deleting all Applications");
                reject();
            } else{
                console.log("Delete all Applications");
                resolve();
            }
        });
    });
}

async function setApplication(arr){
    for(let elem of arr){
        var application = convertApplication(elem);
        await createApplication(application);
    }

    console.log("Created all Applications!")
}

function createApplication(application){
    return new Promise(function(resolve, reject){
        Application.create(application, function(err, newApplication){
            if(err || !newApplication){
                console.log("Error occurred in creating Application");
                reject();
            } else {
                console.log("Created " + newApplication.name);
                resolve();
            }
        });
    });
}

function convertApplication(obj){
    var ldap_cap = false;
    var ldap_int = false;
    var customRoles = false;
    var type = false;
    if(obj.ldap_cap === "Yes") ldap_cap = true;
    if(obj.ldap_int === "Yes") ldap_int = true;
    if(obj.customRoles === "Yes") customRoles = true;
    if(obj.type === "EA") type = true;

    return {
        name: obj.name,
        description: obj.description,
        type: type,
        ldap_cap: ldap_cap,
        ldap_int: ldap_int,
        customRoles: customRoles
    }
}

async function listAllApplications()
{
    let allApplications = await Application.find();

    for(let application of allApplications){
        await seedAppRole(application);
    }

    console.log("Finished with all applications")
}

async function setOwners(arr){
    for(let elem of arr){
        await addOwner(elem);
    }

    console.log("Set all Owners!");
}

function addOwner(obj){
    return new Promise(function(resolve, reject){
        Application.findOne({name: obj.name}, function(err, foundApplication){
            if(err || !foundApplication){
                console.log("Error occurred in finding Application");
                reject();
            } else {
                JobRole.findOne({name: obj.owner}, function(err, foundJobRole){
                    if(err || !foundJobRole){
                        console.log("Error occurred in finsing Job Role");
                        reject();
                    } else {
                        foundApplication.owner = foundJobRole;
                        foundApplication.save();
                        foundJobRole.ownedApplications.push(foundApplication);
                        foundJobRole.save();
                        console.log("Set " + foundJobRole.name + " as the owner of " + foundApplication.name);
                        resolve();
                    }
                });
            }
        });
    });
}

async function run()
{
    await deleteAllApplications();
    await setApplication(data.applications);
    await setOwners(data.applications);
    await listAllApplications();
}

module.exports = run;