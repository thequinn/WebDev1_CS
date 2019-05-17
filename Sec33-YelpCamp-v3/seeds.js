var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
  {
      name: "Cloud's Rest",
      image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
      description: "Cloud desc"
  },
  {
      name: "Desert Mesa",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7g7f_0kbL2nYl_neR1wnv5BD7s0-Gdqe1KGXsva0uipGs20eI",
      description: "Desert desc"
  },
  {
      name: "Canyon Floor",
      image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
      description: "Canyon desc"
  }
]


var seedDB = function() {
  Campground.remove(function(err, removedCampground) {
    if (err)    console.log(err);
    console.log("All campgrounds deleted.");

    data.forEach((seed) => {
      Campground.create(seed, (err, campground) => {
        if (err)    console.log(err);
        console.log("A new campground created.");

        Comment.create(
          {
            text: "1st comment",
            author: "Flying Jini"
          }, function(err, comment) {
            if (err)    console.log(err);
            console.log("A new comment created:\n", comment);

            console.log("\n==================================\ncampground - before push():", campground);

            campground.comments.push(comment);
            console.log("campground - after push(), before save():", campground);

            campground.save();
            console.log("campground - after save():", campground);
          });
      });
    });
  });
}

module.exports = seedDB;
