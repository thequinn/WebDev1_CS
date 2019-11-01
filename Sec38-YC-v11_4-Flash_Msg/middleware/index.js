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

// If the user is NOT logged in
  //
  // - The msg val won't be added(displayed) to the flash until the redirected page is displayed.  
  //
  // Set up key-val pair for connect-flash middleware
  // - key: 'error', val: '!!! Please login first !!!'
  req.flash('error', 'Please login first');  /***** NEWLY ADDED *****/
  res.redirect("/login");
};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  // If the user is logged in
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      if (err) {
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
  if(req.isAuthenticated()){  // Check if the user is logged in
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
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
