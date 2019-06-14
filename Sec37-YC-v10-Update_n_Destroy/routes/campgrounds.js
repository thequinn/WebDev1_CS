var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    Campground  = require("../models/campground");

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
router.get("/new", isLoggedIn, function(req, res){
   res.render("campgrounds/new.ejs");
});

// CREATE route - add new campground to DB
router.post("/", isLoggedIn, function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;

  // To review where "req.user" comes from, search for "req.user" in routes/comment.js in YelpCamp-v8
  //console.log("req.user:\n", req.user);

  // Neater way to fill in author property of campground in models/campground.js.  So we can add this author obj to the newCampground obj below 
  var author = {
      id: req.user._id,
      username: req.user.username
  }

  var newCampground = {name: name, image: image, description: desc, author: author}

  // Replaced by ln-33 ~ ln-36
  //newCampground.author.id = req.user._id;
  //newCampground.author.username = req.user.username;
  
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
router.get("/:id/edit", checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    res.render("campgrounds/edit", {campground: foundCampground});
  });
});

// UPDATE route
router.put("/:id", checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// DELETE route
router.delete('/:id', checkCampgroundOwnership, function(req, res) {
  Campground.findOneAndRemove(req.params.id, function(err, foundCampground) {
    if (err) {
      console.log("err");
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

//-----------------------------------------
function checkCampgroundOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id).exec(function(err, foundCampground) {
      if (err) {
        res.redirect("back");
      } else {
        if (foundCampground.author.id.equals(req.user._id)) {
          //res.render("campgrounds/edit", {campground: foundCampground}); 
          next();
        } else {
          //res.send("You don't have permission to edit the campground");
          res.redirect("back");
        }        
      }
    });
  } else {
    //res.send("You need to be logged in to edit a campground");
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