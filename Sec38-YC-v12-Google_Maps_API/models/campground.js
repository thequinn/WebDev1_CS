var mongoose = require("mongoose");

// SCHEMA SETUP
var CampgroundSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  description: String,

  // For adding Google Maps
  location: String,
  lat: Number,
  lng: Number,

  author: {
    id: {
      // Add ObjectId to ref userSchema
      type: mongoose.Schema.Types.ObjectId,
      // Add ref to the User model
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