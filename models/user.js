var mongoose                = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");

// Creating model
var UserSchema =  new mongoose.Schema({
        username:   { type: String, unique: true },
        password:   String,
        firstname:  String,
        lastname:   String,
        email:      String,
        company:
          {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Company',
          },
        admin:      Boolean
});

UserSchema.plugin(passportLocalMongoose); // Adds some methods to UserModel.

// Exporting the model so app.js can require it
module.exports = mongoose.model("User", UserSchema);
