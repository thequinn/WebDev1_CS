var mongoose = require("mongoose");

// Create a schema for comments
var CommentSchema = mongoose.Schema({
  text: String,

  /*
  Data Association:
  - Save author's name to a comment, so a user only needs to enter a new comment, and the website knows whom the user is.
  */
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      // Add ref to User model where the ObjectId refers to.
      ref: "User"
    },
    username: String
  }
});

module.exports = mongoose.model("Comment", CommentSchema);