// Import NPM Libraries
var mongoose = require("mongoose");
var excelToJson = require('convert-excel-to-json');
var AppRole = require("../models/appRole.js")

var seedConnections = require("./seedConnections.js");

function deleteAllAppRoles(application){
    return new Promise(function(resolve, reject){
        AppRole.deleteMany({application: application}, function(err){
            if(err){
                console.log("Error in deleting all App Roles");
                reject();
            } else{
                console.log("Deleted all App Roles");
                resolve();
            }
        });
    });
}

async function setAppRoles(arr, application){
    for(let elem of arr){
        await addAppRole(elem, application);
    }

    console.log("Created Applications for " + application.name + "!");
}

function addAppRole(obj, application){
    return new Promise(function(resolve, reject){
        AppRole.create({name: obj.name, adGroup: obj.adGroup, description: obj.description, application: application}, function(err, newAppRole){
            if(err || !newAppRole){
                console.log("Error occirred in creating App Role");
                reject();
            } else {
                application.appRoles.push(newAppRole);
                application.save();
                console.log("Created " + newAppRole.name + "!");
                resolve();
            }
        });
    });
}

async function run(application){
    var data = excelToJson({
        sourceFile: './seed/appRoles.xlsx',
        sheets: [application.name],
        header: {
            rows: 5
        },
        columnToKey: {
            A: "name",
            B: "adGroup",
            C: "description"
        }
    });

    await deleteAllAppRoles(application);
    await setAppRoles(data[application.name], application);

    await seedConnections(application);

}

module.exports = run;