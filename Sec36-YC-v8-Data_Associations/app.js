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

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

//---------------------------------------------------------
// Express Router Config
//---------------------------------------------------------
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/", indexRoutes);  // same as: app.use(indexRoutes);


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

app.listen("8080", "localhost", function(err) {
   console.log("The YelpCamp Server Has Started!");
});
