const express = require("express");
const router = express.Router({mergeParams: true});

const Campground = require("../models/campground");
const Comment = require("../models/comment");

router.get("/new", isLoggedIn, function(req, res){
  console.log("req.params.id:", req.params.id);
  console.log("req.params:", req.params);

  Campground.findById(req.params.id, function(err, campground){
      if(err){
          console.log(err);
      } else {
           res.render("comments/new", {campground: campground});
      }
  })
});

router.post("/", isLoggedIn,function(req, res){
 //lookup campground using ID
 Campground.findById(req.params.id, function(err, campground){
     if(err){
         console.log(err);
         res.redirect("/campgrounds");
     } else {
       Comment.create(req.body.comment, function(err, comment){
         if(err){
             console.log(err);
         } else {
             campground.comments.push(comment);
             campground.save();
             res.redirect('/campgrounds/' + campground._id);
         }
       });
     }
 });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
}

module.exports = router;