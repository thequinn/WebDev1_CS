var Campground = require("../models/campground"),
    Comment    = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
      Campground.findById(req.params.id, function(err, foundCampground) {
        if (err || !foundCampground) {
          req.flash("error", "Campground not found");
          res.redirect("back");
        } else {
          if (foundCampground.author.id.equals(req.user.id)) {
            next();
          } else {
            req.flash("error", "You don't have permission to do that");
            res.redirect("back");
          }
        }
      });
    } else {
      req.flash("error", "You need to be logged in to do that");
      res.redirect("back"); // Go back to previous page
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err || !foundComment){
        req.flash("error", "Comment not found");
        res.redirect("back");
      } else {
        if(foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that"); // Notice: req
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that"); // Notice: req
    res.redirect("back");
  }
}

middlewareObj.isLoggedIn = function(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  /*
  - Add flash msg to req of middleware, the msg will display in client.

  - Adding this ln won't display anything, but only gives us the way of
    accessing it on the next request and handle it in /routes/index.js:
      router.get("/login", function(req, res){
        res.render("login", {message: req.flash("error")});
      });
  -- "error" is just a KEY to link to the msg "You need to be logged in to do that" as value
  -- "{message: req.flash("error")}" from above is added to display the flash
     msg in template/views
  */
  req.flash("error", "You need to be logged in to do that"); // Notice: req
  res.redirect("/login"); // Notice: res
};

module.exports = middlewareObj;
