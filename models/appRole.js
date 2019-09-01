var mongoose = require("mongoose");

var appRoleSchema = new mongoose.Schema({
    name: String,
    adGroup: String,
    description: String,
    jobRoles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "jobrole"
        }
    ],
    application: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "application"
    }
});

module.exports = mongoose.model("approle", appRoleSchema);