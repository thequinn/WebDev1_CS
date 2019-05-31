var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seed"),
    passport    = require("passport"),
    LocalStrategy = require('passport-local'),
    User        = require("./models/user");

// Requring my modules that'll be used as Express Router middleware in app.use() below
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");


mongoose.connect("mongodb://localhost/yelp_camp_v8-Quinn");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname +'/public'))
app.set("view engine", "ejs");
//seedDB();

//---------------------------------------------------------
// Authentication Config and Init
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
// Make req.user available in all (views) templates by adding a new var in res.locals
// (Notice: re"q".user and re"s".locals.currentUser)
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

//---------------------------------------------------------
// Express Router Config
//---------------------------------------------------------
/*
app.use(): 
- Bind application-level middleware to an instance of the app object

ex.
app.use("/", indexRoutes);
- indexRoutes is a middleware function mounted on the "/" path. 
  (indexRoutes was required from routes/index.js)
- The function is executed for any type of HTTP request on the path.

Note: 
- See "var router  = express.Router();" in index.js to know why indexRoutes 
  is a middleware func.
*/
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/", indexRoutes);  // same as: app.use(indexRoutes);

//---------------------------------------------------------
// Middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

// For running on cloud9:
//app.listen(process.env.PORT, process.env.IP, function(err, req) {
//
// For running on localhost:
app.listen("8080", "localhost", function(err) {
   console.log("The YelpCamp Server Has Started!");
});
