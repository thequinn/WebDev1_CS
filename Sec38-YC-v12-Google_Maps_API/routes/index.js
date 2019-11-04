var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");

router.get("/", function(req, res){
  res.render("landing");
});

// show register form
router.get("/register", function(req, res){
  // Update the nav-bar menu by adding 2nd arg.  See <nav> in header.js
  res.render("register", {page: 'register'}); 
});

//handle sign up logic
router.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
    if(err){
      // Fix registration flash message bug:
      // - Currently, when you register a new user with an existing username, the app should reload the register view and display a flash message. But the flash message doesn't appear unless you reload the register page a second time, or navigate to another page.
      //
      // WRONG!
      // req.flash("error", err.message);
      // return res.render("register");
      //
      // Correct:
      console.log(err); // Print err to server
      return res.render("register", {error: err.message});
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
  // Update the nav-bar menu by adding 2nd arg.  See <nav> in header.js
  res.render( "login", {page: 'login'}); 
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