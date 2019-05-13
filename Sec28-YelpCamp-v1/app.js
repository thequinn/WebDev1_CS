const port = 8080;
const ip = '127.0.0.1';
const express = require('express')
const app = express()
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
  {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
  {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
  {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
];

app.get('/', (req, res) => {
  //res.send('Hello World!');
  res.render("landing.ejs");
});

app.get('/campgrounds', (req, res) => {
  console.log(campgrounds);  
  // res.send("campgrounds", campgrounds);
    // res.render("campgrounds.ejs");
    res.render("campgrounds.ejs", {campgrounds: campgrounds});
});

app.post('/campgrounds', (req, res) => {
  console.log("req.body ===============> ", req.body);
  console.log("res.body ===============> ", res.body);

  var newCampground = {
    name: req.body.name,
    image: req.body.image
  };
  campgrounds.push(newCampground);

  // res.send("YOU HIT THE POST ROUTE!");
  res.render("campgrounds.ejs", {campgrounds: campgrounds});
  //res.redirect("/campgrounds");
});

app.get('/campgrounds/new', (req, res) => {
  res.render("new.ejs");
});

app.listen(port, ip, () => {
  console.log(`Server listening.....`);
});