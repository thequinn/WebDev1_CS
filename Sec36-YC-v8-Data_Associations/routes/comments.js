var express     = require("express");

/*
Adding "{mergeParams: true}" in express.Router() merges params from 
campgrounds and comments together.  So "/campground/:id" will 
be merged with "/comments" in:
    app.use("/campgrounds/:id/comments", commentRoutes);
in app.js.  Thus, ":id" is passed thr to comments.js here.  
*/
var router  = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");

// NEW route - show form to create new comment
//router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
router.get("/new", isLoggedIn, function(req, res) {   
  /*
  - The line below calls the "NEW route" here from show.ejs:
    <a class="btn btn-success" href="/campgrounds/<%= campground._id %>/comments/new">Add New Comment</a>
  - campground._id is passed as params to URL from show.ejs to here.
    
  
  ----------------------
  From Browser or nodemon:

  TypeError: /Users/asun/BitBucket/WebDev1_CS/Sec36-YelpCamp-v7/v7-Quinn-2019/views/comments/new.ejs:4
   2| <div class="container">
   3|     <div class="row">
>> 4|         <h1 style="text-align: center">Add New Comment to <%=     campground.name %></h1>
   5|         <div style="width: 30%; margin: 25px auto;">
   6|             <form action="/campgrounds/<%= campground._id %>/comments" method="POST">
   7|                 <div class="form-group">

   Cannot read property 'name' of null
   ----------------------------
  - The reason we got the error above is b/c id param isn't making it thr the 
    comment routes below in app.js:
        app.use("/campgrounds/:id/comments", commentRoutes);
    
    We can prove it from console.log() prints "null" below
      
  - Solution: Add "{mergeParams: true}" in:
      var router  = express.Router({mergeParams: true});
  */
  //console.log("req.params.id:", req.params.id); // null
  
  Campground.findById(req.params.id, function(err, campground){
      if(err){
          console.log(err);
      } else {
          res.render("comments/new", {campground: campground});
      }
  })
});

// CREATE route - add new comment to DB
//router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {    
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
          //console.log("req.user:\n", req.user);
          // Add username and id to comment
          newComment.author.id = req.user._id;
          newComment.author.username = req.user.username;
          // Save comment
          newComment.save();

          foundCampground.comments.push(newComment);    
          foundCampground.save();

          console.log("newComment:\n", newComment);     

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