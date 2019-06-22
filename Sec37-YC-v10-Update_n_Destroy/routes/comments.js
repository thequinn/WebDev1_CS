var express     = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// NEW route - show form to create new comment
router.get("/new", middleware.isLoggedIn, function(req, res) {   
  Campground.findById(req.params.id, function(err, campground){
      if(err){
          console.log(err);
      } else {
          res.render("comments/new", {campground: campground});
      }
  })
});

// CREATE route - add new comment to DB
router.post("/", middleware.isLoggedIn, function(req, res) {   
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
        newComment.save(); // save newComment to DB

        foundCampground.comments.push(newComment);         
        foundCampground.save(); // save foundCampground to DB
        res.redirect('/campgrounds/' + foundCampground._id);
      }
      });
    }
  });
});

// EDIT route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {campgroundId: req.params.id, comment: foundComment});
    }
  });
});

// UPDATE route
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  var update = req.body.comment;
  Comment.findByIdAndUpdate(req.params.comment_id, update, (err, foundComment) => {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err, foundComment) => {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;