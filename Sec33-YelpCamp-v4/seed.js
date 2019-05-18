var express     = require("express"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seed");

var data = [
  {
      name: "Cloud's Rest",
      image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
      description: "blah blah blah"
  },
  {
      name: "Desert Mesa",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7g7f_0kbL2nYl_neR1wnv5BD7s0-Gdqe1KGXsva0uipGs20eI",
      description: "blah blah blah"
  },
  {
      name: "Canyon Floor",
      image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
      description: "blah blah blah"
  }
]

// Remove everything in the current DB, and then add seed data
var seedDB = function() {
  Campground.remove({}, function(err) {
    if (err) {
      console.log(err);
    }
    console.log("Campgrounds removed");

    /*
    - Originally, data.forEach(...used to create campgrounds...) is outside of
      Campground.remove()'s callback func.
    - Doing so don't guarantee Campground.remove() is finished before
      data.forEach() starts.  This's why data.forEach() has to be in the callback.
    */
    data.forEach(function(seed) {
      Campground.create(seed, function(err, campground) {
        if (err) {
          console.log(err);
        }
        console.log("A campground added");

        // Again, do create() inside create()'s callback b/c of JS Async
        Comment.create({
          text: "1st comment",
          author: "Flying Jini"
        }, function(err, comment) {
          if (err) {
            console.log(err);
          }
          console.log("A comment created");
    console.log("\ncampground - before push:", campground);
          campground.comments.push(comment);

    console.log("campground - after push, before save:", campground);
          // DON'T forget to save to DB!  campground.comments.push(comment); does NOT automatically save the newly added comment to DB.
          campground.save(); 
    console.log("campground - after save:", campground); 
        });        
      });
    });
  });
}

module.exports = seedDB;
