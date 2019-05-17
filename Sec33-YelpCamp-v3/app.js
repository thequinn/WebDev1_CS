var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
// var campgroundSchema = new mongoose.Schema({
//    name: String,
//    image: String,
//    description: String
// });

// var Campground = mongoose.model("Campground", campgroundSchema);

seedDB();

// Campground.create(
//   {
//     name: "Salmon Creek", 
//     image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"
//   }, function(err, campground) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Newly Created Campground: \n", campground);
//     }
// });

// Campground.create(
//     {
//         name: "Granite Hill", 
//         image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"
//     }, function(err, campground) {
//       if (err) {
//           console.log(err);
//       } else {
//           console.log("Newly Created Campground: \n", campground);
//       }
//   });

// Campground.create(
//   {
//     name: "Mountain Goat's Rest", 
//     image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"
//   },
//   function(err, newCampground) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("NEWLY CAMPGROUND ADDED: \n", newCampground);
//     }
//   });

// var campgrounds = [
//   { name: "Salmon Creek", 
//     image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//   { name: "Granite Hill", 
//     image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//   { name: "Mountain Goat's Rest", 
//     image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
// ];

app.get("/", function(req, res){
    res.render("landing");
});

// INDEX route - show all campgrounds
app.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("index",{campgrounds:allCampgrounds});
       }
    });
});

// CREATE route - add new campground to DB
app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW route - show form to create new campground
app.get("/campgrounds/new", function(req, res){
   res.render("new.ejs");
});

// SHOW route - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
});

//app.listen(process.env.PORT, process.env.IP, function(){
app.listen(8080, "localhost", function() {
   console.log("The YelpCamp Server Has Started!");
});
