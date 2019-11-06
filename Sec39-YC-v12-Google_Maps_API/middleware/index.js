var Campground = require("../models/campground"),
    Comment    = require("../models/comment");

// All the middleare goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
// If the user is logged in
  if(req.isAuthenticated()){
    // next() leads you to go to the next middleware/callback belonging to the route that uses isLoggedIn middleware
    return next();
  }

  req.flash('error', 'Please login first');  /***** NEWLY ADDED *****/
  res.redirect("/login");
};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  // If the user is logged in
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      // If there is an err or the campground based on provided id is not found
      // - "err" is returned by mongoDB when a campground id is shorter than a specific length
      // - "null" is returned when a campground id length fits mongoDB's criteria, but can't be found.
      // ==> Scenario: 
      //     When a Hacker enters a non-existing campground id in the browser addr bar, but the id length is as long as an existing one. The Hacker broke our app!!
      // 
      // NOTICE!!  
      // Not checking "!foundCampground" broke the app!!
      // - "!foundCampground" returns T if foundCampground returns null.
      // => Tip! 
      //    null returns null, 
      //   !null returns true,      -> !!null wil return false
      // 
      if (err || !foundCampground) {
        /***** NEWLY ADDED *****/
        req.flash("error", "Campground not found");
        res.redirect("back"); 
      }
      else {
        // If foundCampground's author is the same as the logged-in user
        if (foundCampground.author.id.equals(req.user.id)) {
          next();
        } else {
          /***** NEWLY ADDED *****/
          req.flash("error", "Permission denied");
          res.redirect("back");
        }
      }
    });
  } 
  // If the user is NOT logged in
  else {
    /***** NEWLY ADDED *****/
    req.flash("error", "Please login to edit a campground");
    res.redirect("back"); 
  }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
  // If the user is logged in
  if(req.isAuthenticated()){  
    Comment.findById(req.params.comment_id, function(err, foundComment){
      // If there is an err or the comment based on provided id is not found
      // NOTICE!!  
      // Not checking "!foundComment" broke the app!!
      if(err || !foundComment){
        /***** NEWLY ADDED *****/
        req.flash("error", "Comment not found");
        res.redirect("back");
      } else {
        if(foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          /***** NEWLY ADDED *****/
          req.flash("error", "Permission denied");
          res.redirect("back");
        }
      }
    });
  } else {
    /***** NEWLY ADDED *****/
    req.flash("error", "Please login to edit a comment");
    res.redirect("back");
  }
}

module.exports = middlewareObj;
