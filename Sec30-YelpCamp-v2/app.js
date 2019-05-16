var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create(
//   {
//     name: "Salmon Creek", 
//     image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg",
//     description: "Salmon desc"
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
//         image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
//         description: "Granite desc"
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
//     image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg",
//     description: "Mountain desc"
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

// Notice:
// The route of "/campgrounds" in app.get() are diff from the route of "/campgrounds" in app.post(), even though the 2 routes have the same name.
app.get("/campgrounds", function(req, res){
  Campground.find({}, function(err, existingCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {campgrounds: existingCampgrounds});
    }
  });
});

// get data from form and add to campgrounds array
app.post("/campgrounds", function(req, res){
  // Add newCampground to DB
  //campgrounds.push(newCampground);
  Campground.create(
    {
      name: req.body.name, 
      image: req.body.image, 
      description: req.body.description
    }, function(err, newCampground) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/campgrounds");
      }
    });
});

// The client's route of "...../campgrounds/new" will call this server's func below.
app.get("/campgrounds/new", function(req, res){
  // Redirect to new.ejs, which has a form to submit a new campground.
  res.render("new.ejs");
});

app.get("/campgrounds/:id", function(req, res) {
  console.log("req: ", req.params.id);
  Campground.findById(req.params.id, function(err, foundCampground) {
      if (err)  console.log(err);
      else {
        console.log(foundCampground);
        res.render("show", {campground: foundCampground});
      }
    });
});

//app.listen(process.env.PORT, process.env.IP, function(){
app.listen(8080, "localhost", function() {
  console.log("The YelpCamp Server Has Started!");
});
