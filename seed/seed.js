var seedJobRole = require("./seedJobRole.js"); // Get Seed file
var seedApplication = require("./seedApplication.js"); // Get Seed file

async function seedDB(){
    await seedJobRole();
    await seedApplication();
}

module.exports = seedDB;