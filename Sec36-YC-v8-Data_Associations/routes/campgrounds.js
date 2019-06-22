var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    Campground        = require("../models/campground");

//INDEX - show all campgrounds
router.get("/", function(req, res){
  Campground.find({}, function(err, allCampgrounds){
     if(err){
      console.log(err);
     } else {
       res.render("campgrounds/index", {campgrounds:allCampgrounds});
     }
  });
});

// NEW route - show form to create new campground
router.get("/new", function(req, res){
 res.render("campgrounds/new.ejs");
});

// CREATE route - add new campground to DB
router.post("/", function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: desc}
  Campground.create(newCampground, function(err, newCampground){
      if(err){
        console.log(err);
      } else {
        res.redirect("campgrounds");
      }
  });
});

// SHOW route - shows more info about one campground
router.get("/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
      if(err){
        console.log(err);
      } else {
        res.render("campgrounds/show", {campground: foundCampground});
      }
  });
})


function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
};

module.exports = router;
