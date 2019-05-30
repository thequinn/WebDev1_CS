var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = mongoose.Schema({
  username: String,
  passport: String
});

// Plugin Passport-Local Mongoose
UserSchema.plugin(passportLocalMongoose);

//var User = mongoose.model('User', UserSchema);
//module.exports = User;
//
// Same as above 2 lines
module.exports = mongoose.model("User", UserSchema);