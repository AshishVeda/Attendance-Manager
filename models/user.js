var mongoose = require("mongoose");
var localSchema = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  id: Number
});
userSchema.plugin(localSchema);
module.exports = mongoose.model("User", userSchema);
