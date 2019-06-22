var express     = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// NEW route - show form to create new comment
router.get("/new", isLoggedIn, function(req, res) {   
  Campground.findById(req.params.id, function(err, campground){
      if(err){
          console.log(err);
      } else {
          res.render("comments/new", {campground: campground});
      }
  })
});

// CREATE route - add new comment to DB
router.post("/", isLoggedIn, function(req, res) {    
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err) {
      console.log(err);
    }
    else {
      Comment.create(req.body.comment, function(err, newComment) {
        if (err) {
          console.log(err);
          res.redirect("/campgrounds");
        }
        else {         
          newComment.author.id = req.user._id;
          newComment.author.username = req.user.username;
          newComment.save();

          foundCampground.comments.push(newComment);    
          foundCampground.save();

          res.redirect('/campgrounds/' + foundCampground._id);
        }
      });
    }
  });
});


function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
};

module.exports = router;
