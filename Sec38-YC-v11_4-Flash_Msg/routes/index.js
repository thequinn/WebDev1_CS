var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");

router.get("/", function(req, res){
  res.render("landing");
});

// Show register form
router.get("/register", function(req, res){
  res.render("register");
});

// Handle sign up logic
router.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
      if(err){  // err comes back from Mongoose

        /***** NEWLY ADDED *****/
        req.flash("error", err.message); // err is an obj
        // console.log(err);

        /*
        - Problem: Flash msg displays on the page after the rendered page.  
        - Fix: connect-flash is intended to display msgs on the next req.  If your code generates msgs in the same req, simply pass the msgs to the view model directly.  
        */
        // return res.render("register"); // WRONG !!
        //
        return res.redirect("/register"); // Correct
      }
      passport.authenticate("local")(req, res, function(){
        /***** NEWLY ADDED *****/
        req.flash("success", "Welcome to YelpCamp" + user.username);
        res.redirect("/campgrounds");
      });
   });
});

/* LOGIN ROUTES */

// Show login form
router.get("/login", function(req, res){

  /***** NEWLY ADDED *****/
  // Use the key, "error", to tell connect-flash which msg val to display.
  // res.render("login", {message: req.flash("error")});
  //
  res.render('login'); 
});

// Handle login logic
router.post("/login", passport.authenticate("local",
   {
       successRedirect: "/campgrounds",
       failureRedirect: "/login"
   }), function(req, res){
});

/* LOGOUT ROUTES */
router.get("/logout", function(req, res){
  req.logout();

  /***** NEWLY ADDED *****/
  // req.flash("error", "Logged out successfully");  // Red background
  //
  // change background from red to green in /views/partials/header.ejs
  req.flash("success", "Logged out successfully");  
  res.redirect("/campgrounds");
});

module.exports = router;
