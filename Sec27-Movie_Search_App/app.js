const express = require('express');
app = express();
const request = require('request');
app.set('view engine', 'ejs');

app.listen("8080", "127.0.0.1", () => 
	console.log(`Server listening...`)
);

app.get('/', (req, res) => {
	res.render("search");
});

app.get('/results', (req, res) => {
	var query = req.query.mySearch
	var url = "http://www.omdbapi.com/?s=" + query; 

	request(url, (err, response, body) => {

	  if (!err && response.statusCode == 200) {
	  	const data = JSON.parse(body);

			//res.send(data["Search"][0]);	  	
	  	res.render("results.ejs", {dataKey:data});
	  }

	});
});
