// Import NPM Libraries
var mongoose = require("mongoose");
var excelToJson = require('convert-excel-to-json');
var AppRole = require("../models/appRole.js")
var JobRole = require("../models/jobRole.js");

async function setConnections(arr){
    for(let elem of arr){
        await addConnection(elem);
    }

    console.log("Finsihed!");
}

function addConnection(obj){
    return new Promise(function(resolve, reject){
        JobRole.findOne({name: obj.jobRole}, function(err, foundJobRole){
            if(err || !foundJobRole){
                console.log("Error occured in finding Job Role");
                reject();
            } else {
                AppRole.findOne({adGroup: obj.adGroup}, function(err, foundAppRole){
                    if(err || !foundAppRole){
                        console.log("Error occured in finding App Role");
                        reject();
                    } else {
                        foundAppRole.jobRoles.push(foundJobRole);
                        foundAppRole.save();
                        foundJobRole.appRoles.push(foundAppRole);
                        foundJobRole.save();
                        console.log("Added " + foundAppRole.name + " to " + foundJobRole.name);
                        resolve();
                    }
                });
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
            E: "jobRole",
            G: "adGroup"
        }
    });

    await setConnections(data[application.name]);

}

module.exports = run;