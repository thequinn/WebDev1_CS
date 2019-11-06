var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    Campground  = require("../models/campground");

var middleware = require("../middleware");

// Using node-geocoder middleware for Google Maps
/*
Since we can't access .env file directly (ln-20 here), how to use .env file to store the GeoCoder API Key?
- Using "dotenv module" that loads environment var from a .env file into process.env.
==> Setup: 
1) require('dotenv').config();  Put it in your app (server) as early as possible.
2) Create a .env file in the root directory of your project.
3) By 2), process.env has everything you defined in your .env file.  To use node-deocoder module, do the setup below
*/
var NodeGeocoder = require('node-geocoder');
var options = {
  provider: 'google',
  httpAdapter: 'https',
  
  apiKey: process.env.GEOCODER_API_KEY,
  //apiKey: "AIzaSyA1gZYqRLXv8hAX4ntXYEXrBUJasVGaPaA",

  formatter: null
}; 
var geocoder = NodeGeocoder(options);


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
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new.ejs");
});

//CREATE route - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }

  // Use node-geocode middleware to convert between an address and a LatLng.
  geocoder.geocode(req.body.location, function (err, data) {
    //console.log("req.body.location: \n", req.body.location, "\n");

    if (err || !data.length) {
      console.log(err);
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }

    // Get campground coordinate
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;

    var newCampground = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });
});

// SHOW route - shows more info about one campground
router.get("/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {

    if(err || !foundCampground){
      req.flash("error", "Campground not found");
      res.redirect("back"); 
    } else {
      console.log("foundCampground:", foundCampground);
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
})

// EDIT route - v.2
//router.get("/campgrounds/:id/edit", function(req, res) {
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    res.render("campgrounds/edit", {campground: foundCampground});
  });
});

// UPDATE route - Update a particular campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      console.log(err)
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

// DESTROY route - Delete a particular campground

// WRONG: router.delete("/:id/delete",......)
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {

  // findOneAndRemove(...); removed a wrong campground
  Campground.findByIdAndRemove(req.params.id, function(err, foundCampground) {
    if (err) {
      console.log("err");
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
