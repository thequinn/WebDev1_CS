const express     = require("express"),
      app         = express(),
      bodyParser  = require("body-parser"),
      mongoose    = require("mongoose"),
      passport    = require("passport"),
      LocalStrategy = require("passport-local");

const Campground  = require("./models/campground"),
      Comment     = require("./models/comment"),
      User        = require("./models/user"),
      seedDB      = require("./seeds");

const campgroundRoutes = require("./routes/campgrounds"),
      commentRoutes = require("./routes/comments"),
      indexRoutes = require("./routes/index");
    
mongoose.connect("mongodb://localhost/yelp_camp_v7-Quinn");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

app.use(require("express-session")({
    // "secret" is used to decode the info of the session
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());  // Initialize passport
app.use(passport.session());     // Run passport session

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());     // Encode data from a session
passport.deserializeUser(User.deserializeUser()); // Decode data from a session
//---------------------------------------------------------


app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});


app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);


// My customized middleware can be used in any routes to check if a user is loggined in.
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen("8080", "localhost", function(){
//app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});