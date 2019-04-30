// console.log('from index.js...');

var express = require("express");
var app = express();
var animalType;

app.listen("8080", "127.0.0.1", function() {
  console.log("Server listening...");
});

app.get("/", function(req, res) {
  res.send("<h1>Welcome to my lounge</h1>");
});

app.get("/speak/:animalType/", function(req, res) {
	if (req.params.animalType === "pig") {
		res.send("The pig says 'Oink'");
	}
	if (req.params.animalType === "cow") {
		res.send("The pig says 'Moo'");
	}
});

app.get("/repeat/:msg/:times", function(req, res) {
	var msg = req.params.msg;
	var times = Number(req.params.times);
	var result = "";

	for (let i = 0; i < times; i++) {
		result += msg;
	}
	res.send(result);
});

app.get('*', function(req, res){
  res.send('Page not found', 404);
});
