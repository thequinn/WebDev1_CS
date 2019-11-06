var mongoose = require("mongoose");

// Create a schema for comments
var CommentSchema = mongoose.Schema({
  text: String,
  author: {
    id: {
      // Use ObjectId to ref the userSchema
      type: mongoose.Schema.Types.ObjectId,
      // The ref is the name of the User model
      ref: "User"
    },
    username: String
  }
});

module.exports = mongoose.model("Comment", CommentSchema);