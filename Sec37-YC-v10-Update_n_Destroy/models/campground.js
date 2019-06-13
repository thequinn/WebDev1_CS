var mongoose = require("mongoose");

// SCHEMA SETUP
var CampgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,

  /*
  Data Association: 
  - Save id+username to newly created campground, so a user only needs to enter a new campground, and the website knows whom the user is.
  */
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      // Add ref to User model where the ObjectId refers to.
      ref: "User"
    },
    username: String
  },

  comments: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Comment"  
    }
  ] 
});

module.exports = mongoose.model("Campground", CampgroundSchema);