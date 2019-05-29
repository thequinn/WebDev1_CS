const express     = require("express"),
      app         = express(),
      bodyParser  = require("body-parser"),
      mongoose    = require("mongoose"),
      passport    = require("passport"),
      LocalStrategy = require('passport-local'),
      session     = require('express-session')

const Campground  = require("./models/campground"),
      Comment     = require("./models/comment"),
      User        = require("./models/user"),
      seedDB      = require("./seeds")

    
mongoose.connect("mongodb://localhost/yelp_camp_v6-Quinn", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

app.use(session({
  secret: "Today is a sunny day",
  resave:false,
  saveUninitialized: false
}));

app.use(passport.initialize());  
app.use(passport.session());    

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());     
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
 res.locals.currentUser = req.user;
 next();  
});

app.get("/", (req, res) => {
  res.render("landing")
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
  //console.log(req.user);

  // Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds){
    if(err){
        console.log(err);
    } else {
      //res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser:req.user});
      res.render("campgrounds/index",{campgrounds:allCampgrounds});
    }
  });
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res){
  res.render("campgrounds/new"); 
});

//CREATE - add new campground to DB
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

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
  //find the campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      //console.log(foundCampground)
      //render show template with that campground
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});


// ====================
// COMMENTS ROUTES
// ====================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
  // find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  })
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
  //lookup campground using ID
  Campground.findById(req.params.id, function(err, campground){
    if(err){
        console.log(err);
        res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
            console.log(err);
        } else {
            campground.comments.push(comment);
            campground.save();
            res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  var username = new User({username: req.body.username});
  User.register(username, req.body.password, (err, newUser) => {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate('local')(req, res, function () {
      res.redirect('/campgrounds');
    });
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post('/login',
  passport.authenticate('local', { successRedirect: '/campgrounds',
                                   failureRedirect: '/login'})
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

//app.listen(process.env.PORT, process.env.IP, function(){
app.listen(8080, "localhost", function(){
   console.log("The YelpCamp Server Has Started!");
});