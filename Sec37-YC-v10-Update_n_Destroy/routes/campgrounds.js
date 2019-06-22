var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    Campground  = require("../models/campground");
    middleware  = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req, res){
  // Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds:allCampgrounds});
    }
  });
});

// NEW route - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new.ejs");
});

// CREATE route - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;

  var author = {
      id: req.user._id,
      username: req.user.username
  }

  var newCampground = {name: name, image: image, description: desc, author: author}
  
  Campground.create(newCampground, function(err, newlyCreated){
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

// EDIT route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    res.render("campgrounds/edit", {campground: foundCampground});
  });
});

// UPDATE route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// DELETE route
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findOneAndRemove(req.params.id, function(err, foundCampground) {
    if (err) {
      console.log("err");
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;