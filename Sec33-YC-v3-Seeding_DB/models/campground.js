var mongoose = require("mongoose");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [
    { type: mongoose.Schema.Types.ObjectId, // Add ObjectId to ref campgroundSchema
      ref: "Comment"  // Add ref to the Comment model
    }
  ]
});

module.exports = mongoose.model("Campground", campgroundSchema);
