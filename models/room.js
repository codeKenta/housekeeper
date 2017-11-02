var mongoose = require("mongoose");

var RoomSchema = new mongoose.Schema({
  name:         String,
  company:
    {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Company',
    },
  cleaned:      Boolean,
  cleanedBy:    String,
  cleaned_date: String
});

module.exports = mongoose.model("Room", RoomSchema);
