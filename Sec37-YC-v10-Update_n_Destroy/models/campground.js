var mongoose = require("mongoose");

var CampgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,

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
