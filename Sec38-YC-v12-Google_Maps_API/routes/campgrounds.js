var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    Campground  = require("../models/campground");

var middleware = require("../middleware");

// Reqiure the Node library for geocoding.  This is a middleware.
var NodeGeocoder = require('node-geocoder');
// 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  // We can put our API key here, but to be save, put the key in .env
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
var geocoder = NodeGeocoder(options);


//INDEX - show all campgrounds
router.get("/", function(req, res){
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      // Update the nav-bar menu by adding 3rd arg.  See <nav> in header.js
      res.render("campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds'});
    }
  });
});

// NEW route - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new.ejs");
});

//==============================================================================
// CREATE route - add new campground to DB
// router.post("/", middleware.isLoggedIn, function(req, res){
//   var name = req.body.name;
//   var price = req.body.price;
//   var image = req.body.image;
//   var desc = req.body.description;

//   var author = {
//       id: req.user.id,
//       username: req.user.username
//   }
//   var newCampground = {name: name, price: price, image: image, description: desc, author: author}

//   Campground.create(newCampground, function(err, newlyCreated){
//     if(err){
//       console.log(err);
//     } else {
//       res.redirect("campgrounds");
//     }
//   });
// });

// (Replace the last CREATE route by this one)
//CREATE route - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  console.log("-----> req.body:\n", req.body);
  console.log("-----> req.user:\n", req.user);

  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,  
      username: req.user.username
  }

  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};

    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });
});
//==============================================================================

// SHOW route - shows more info about one campground
router.get("/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if(err || !foundCampground){
      req.flash("error", "Campground not found");
      res.redirect("back"); 
    } else {
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
})

// EDIT route - show edit form for one campground
//router.get("/campgrounds/:id/edit", function(req, res) {
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    res.render("campgrounds/edit", {campground: foundCampground});
  });
});

//==============================================================================
// UPDATE route - Update a particular campground, then redirect somewhere
// router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
//   //console.log("req.body has a campground obj:", req.body);
//   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground) {
//     if (err) {
//       res.redirect("/campgrounds");
//     } else {
//       //console.log("campground.js - foundCampground:", foundCampground);
//       res.redirect("/campgrounds/" + req.params.id);
//     }
//   });
// });

// (Replace the last UPDATE route by this one)
// UPDATE route - Update a particular campground, then redirect somewhere
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);  
        }
    });
  });
});
//==============================================================================

// DESTROY route - Delete a particular campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
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
