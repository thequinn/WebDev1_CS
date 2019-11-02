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
        //console.log("req.user:", req.user);
        newComment.author.id = req.user.id;
        newComment.author.username = req.user.username;
        newComment.save();

        foundCampground.comments.push(newComment);
        foundCampground.save();

        req.flash("success", "Successfully added comment");
        res.redirect('/campgrounds/' + foundCampground._id);
      }
      });
    }
  });
});

// EDIT route - show edit form for one comment
//router.get("/campgrounds/:id/comments/:comment_id/edit", function() {
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err || !foundCampground) {
      req.flash("error", "No campground found!");
      return res.redirect("back");
    }
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect("back");
      }
      res.render("comments/edit", {campgroundId: req.params.id, comment: foundComment});
    });
  });
});

// UPDATE route - Update a particular comment, then redirect somewhere
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  //console.log("req.params:", req.params); // campground id and comment id
  //console.log("req.body:", req.body); // name attr from <input> in edit.ejs
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment){
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });

});

// DESTROY route - Delete a particular comment
router.delete("/:comment_id/delete", middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err, foundComment) {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
