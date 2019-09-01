// Import NPM Libraries
var mongoose = require("mongoose");
var excelToJson = require('convert-excel-to-json');
var JobRole = require("../models/jobRole.js");

var data = excelToJson({
    sourceFile: './seed/appRoles.xlsx',
    sheets: ["jobRoles"],
    header: {
        rows: 1
    },
    columnToKey:{
        A: "name",
        B: "manager"
    }
});

function deleteAllJobRoles(){
    return new Promise(function(resolve, reject){
        JobRole.deleteMany(function(err){
            if(err){
                console.log("Error occurred in delete all Job Roles");
                reject();
            } else{
                console.log("Deleted all Job Roles!");
                resolve();
            }
        });
    });
}

async function createAllJobRoles(arr){
    for(let elem of arr){
        await createNewJobRole({name: elem.name});
    }
    console.log("Finsihed Creating Job Roles!");
}

function createNewJobRole(obj){
    return new Promise(function(resolve, reject){
        JobRole.create(obj, function(err, newJobRole){
            if(err || !newJobRole){
                console.log("Error occured in creating Job Role");
                reject();
            } else{
                console.log("Created " + newJobRole.name);
                resolve();
            }
        })
    });
}

async function setParentJobRoles(arr){
    for(let elem of arr){
        await addParentJobRole(elem);
    }
    console.log("Finished with setting parent Job Roles");
}

function addParentJobRole(obj){
    return new Promise(function(resolve, reject){
        JobRole.findOne({name: obj.name}, function(err, childJobRole){
            if(err || !childJobRole){
                console.log("Error occured in finding Job Role");
                reject();
            } else{
                JobRole.findOne({name: obj.manager}, function(err, parentJobRole){
                    if(err || !parentJobRole){
                        console.log("Error occured in finding Job Role");
                        reject();
                    } else{
                        childJobRole.parent = parentJobRole;
                        childJobRole.save();
                        console.log(parentJobRole.name + " set as parent of " + childJobRole.name);
                        resolve();
                    }
                });
            }
        });
    });
}

async function setChildJobRoles(){
    let allJobRoles = await JobRole.find();

    for(let jobRole of allJobRoles){
        await addChildJobRole(jobRole);
    }

    console.log("Fisnihed adding children");
}

function addChildJobRole(jobRole){
    return new Promise(function(resolve, reject){
        JobRole.find({parent: jobRole}, function(err, childJobRoles){
            if(err || !childJobRoles){
                console.log("Error occured in finding Children Job Roles");
                reject();
            } else{
                jobRole.children = childJobRoles;
                jobRole.save();
                console.log("Added children to " + jobRole.name);
                resolve();
            }
        });
    })
}

async function listAllJobRoles()
{
    let allJobRoles = await JobRole.find().populate("parent children", "name");

    for(let jobRole of allJobRoles){
        await console.log(jobRole);
    }
}

async function run()
{
    await deleteAllJobRoles();
    await createAllJobRoles(data.jobRoles);
    await setParentJobRoles(data.jobRoles);
    await setChildJobRoles();
}

module.exports = run;