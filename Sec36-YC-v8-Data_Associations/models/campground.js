var mongoose = require("mongoose");

// SCHEMA SETUP
var CampgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [
    { type: mongoose.Schema.Types.ObjectId,
      // Add ref to Comment model that's refered to by the ObjectId last ln
      ref: "Comment"
    }
  ]
});

module.exports = mongoose.model("Campground", CampgroundSchema);
