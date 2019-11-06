var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");

router.get("/", function(req, res){
  res.render("landing");
});

// show register form
router.get("/register", function(req, res){
  res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
    if(err){
      //console.log(err); // err obj contains multiple key-val pairs
      //req.flash("error", err);  // Print: [object Object]
      //
      // passport-local got err.message from mongoose
      req.flash("error", err.message);

      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome to YelpCamp " + user.username);
      res.redirect("/campgrounds"); 
    });
   });
});

/* LOGIN ROUTES */

// show login form
router.get("/login", function(req, res){
  /*  
  Note !!
  - router.get("/new", middleware.isLoggedIn, function(req, res){...} in 
    campground.js causes this route to indirectly use inLoggedIn middleware
  

  - Step A-1: 
  -- "{message: req.flash("error")}" is added here to use the flash msg from 
     isLoggedIn middleware in /middleware/index.js
  -- {message: ...} is rendered in login.ejs
  */
  //res.render( "login", {message: req.flash("error")});

  /*
  - Step A-2:
  -- ln 37 is replaced by ln 52 b/c of 2 changes:
  (1) Add "<h1><%= message %></h1>" in header.ejs (Later replaced w/ "<h1><%= msgError %></h1>")
  (2) Add "req.flash("error")" to code below in app.js, so the flash msg is 
      available in all templates:

        app.use(function(req, res, next){
          res.locals.currentUser = req.user;
          res.locals.message = req.flash("error");
          next();
        });
  */
  res.render( "login"); 
});

router.post("/login", passport.authenticate("local", 
   {
      successRedirect: "/campgrounds",
      failureRedirect: "/login"
   }), function(req, res){
});
 
/* LOGOUT ROUTES */
router.get("/logout", function(req, res){
  req.logout();
  /*
  - Step B-1:
  Add flash msg to "req of client" directly, the msg will display in client/template/view.
    Note:
      - Diff from adding flash msg to a middleware
      - See: "middlewareObj.isLoggedIn = function(req, res, next) {...} in 
             /middleware/index.js" for details)
  */
  req.flash("error", "Logged you out");
  res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
};

module.exports = router;