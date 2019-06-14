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
        /*
        Note: How does req.user get here?
        - When there is a logged-in user, passport will create "req.user" and put username and id (not password) from DB into "req.user".


        - req.user is sure to be available here b/c the ln below has 
        "isLoggedIn" middleware func.
            router.post("/",isLoggedIn,function(req, res){...}
        -- meaning inside isLoggedIn(), only if a user is authenticated will next() be invoked (to run the callbackFunc in ln 20).  Otherwise, the user is redirected to "/login". 
        */
        //console.log("req.user:", req.user);
        //add username and id to newComment
        newComment.author.id = req.user._id;
        newComment.author.username = req.user.username;
        /*
        Con't from models/comment.js:
        - The reason we can associate users(authors) and comments (by assigning values to the "author" obj in commentSchema) is that passport module made req.user available.  
        */

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
router.get("/:comment_id/edit", checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {campgroundId: req.params.id, comment: foundComment});
    }
  });
});

// UPDATE route
router.put("/:comment_id", checkCommentOwnership, (req, res) => {
  var update = req.body.comment;
  Comment.findByIdAndUpdate(req.params.comment_id, update, (err, foundComment) => {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

router.delete("/:comment_id", checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err, foundComment) => {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//-----------------------------------------
function checkCommentOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id).exec(function(err, foundComment) {
      if (err) {
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }        
      }
    });
  } else {
    res.redirect("back");
  }
}

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
};

module.exports = router;