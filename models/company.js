var mongoose                = require("mongoose");
// Creating model
var CompanySchema = new mongoose.Schema({
        name:   { type: String, unique: true },
});

// Exporting the model so app.js can require it
module.exports = mongoose.model("Company", CompanySchema);
