var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");

var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
// ./app.js and ./seeds.js in same level of root directory
var seedDB = require("./seed");

mongoose.connect("mongodb://localhost/yelp_camp_v4");
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'))

app.set("view engine", "ejs");
seedDB(); // Remove all previously stored campgrounds

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
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

// CREATE route - add new campground to DB
app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
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
   res.render("campgrounds/new.ejs");
});

// SHOW route - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})

// ====================
// COMMENTS ROUTES
// ====================

app.get("/campgrounds/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, (err, campground) => {
      if (err)      console.log(err);
      res.render("comments/new", {campground: campground});
    });
});

app.post("/campgrounds/:id/comments", function(req, res) {
  // console.log("****************\nreq.params.id: ", req.params.id);
  Campground.findById(req.params.id, function(err, campground) {
    if (err)    console.log(err);
    console.log("Found campground:\n", campground);
    
    var text = req.body.comment.text.replace(/\s/g, '');
    var author = req.body.comment.author.replace(/\s/g, '');

    Comment.create({text: text, author: author}, (err, comment) => {
      if (err)    console.log(err);
      campground.comments.push(comment);
      campground.save();

      // res.send("comment sent");
      res.redirect("/campgrounds/" + campground._id);
    });
  });
});

// For running on cloud9:
//app.listen(process.env.PORT, process.env.IP, function(err, req) {
//
// For running on localhost:
app.listen(8080, "localhost", function(err) {
   console.log("The YelpCamp Server Has Started!");
});
