// Project          : UQuire 
// File             : ~/Documents/WebDev/UQuire/models/application.js
// Description      : Application Model
// Author           : Rajas Gupta
// Date Created     : July 24th, 2019
// Data Modified    : August 2nd, 2019

var mongoose = require("mongoose");

var applicationSchema = new mongoose.Schema({
    name: String,
    description: String,
    ldapCapability: Boolean,
    ldapIntegration: Boolean,
    customRoles: Boolean,
    appRoles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "approle"
        }
    ],
    owner: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "jobrole"
    }
});

module.exports = mongoose.model("application", applicationSchema);