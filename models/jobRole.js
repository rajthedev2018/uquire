var mongoose = require("mongoose");

var jobRoleSchema = new mongoose.Schema({
    name: String,
    appRoles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "approle"
        }
    ],
    ownedApplications: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "application"
        }
    ],
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "jobrole"
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "jobrole"
        }
    ]
});

module.exports = mongoose.model("jobrole", jobRoleSchema);