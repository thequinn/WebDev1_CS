require('dotenv').config();

var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seed"),
    User        = require("./models/user");

//requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

mongoose.connect(
  "mongodb://localhost/yelp_camp_v11-7", 
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname +'/public'));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
// Make Express use connect-flash module by executing the flash() variable
app.use(flash()); // Need to be before passport config
//seedDB();  // Clean and then seed the DB

//---------------------------------------------------------
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());  
app.use(passport.session());     

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());     
passport.deserializeUser(User.deserializeUser()); 
//---------------------------------------------------------
 
app.use(function(req, res, next){
  res.locals.currentUser = req.user;

  res.locals.msgError = req.flash("error");  
  res.locals.msgSuccess = req.flash("success");

  next();  // DON'T FORGET, OR CODE WON"T MOVE ON !!
});

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/", indexRoutes);


// For running on cloud9:
//app.listen(process.env.PORT, process.env.IP, function(err, req) {
//
// For running on localhost:
app.listen("5666", "localhost", function(err) {
   console.log("The YelpCamp Server Has Started!");
});
