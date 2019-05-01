
const express = require('express')
const app = express()
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

var friends = ["Will", "Alec", "Sam"];

app.listen(8080, "127.0.0.1", () => 
 	console.log(`Server listening...`)
)

app.get("/", (req, res) => {
	res.render("home.ejs");
})

app.get('/friends', (req, res) => {
	res.render("friends.ejs", {friends: friends});
})

app.post('/addfriend', (req, res) => {
	console.log("req.body.newfriend:-",req.body.newfriend, "-");
	var newFriend = req.body.newfriend;
	friends = friends.concat(newFriend);
	console.log(friends);

	//res.render("friends.ejs", {friends: friends}); 
	res.redirect("/friends");  // same as last ln
})