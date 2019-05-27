const express  = require('express')
const app = express()
const bodyParser = require('body-parser')

const mongoose = require('mongoose');

const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');

const User = require("./models/user");


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }))


app.use(require("express-session")({
  // "secret" is used to decode the info of the session
  secret: "Do Martians really exist or they are fictional?",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect('mongodb://localhost/AuthDemo', {useNewUrlParser: true});

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/', (req, res) => {
  res.render("home");
})

app.get('/secret', isLoggedIn, (req, res) => {
  res.render("secret");
})

app.get('/register', (req, res) => {
  res.render("register");
});

app.post('/register', (req, res) => {
  console.log("req.body: ", req.body.username, "  ", req.body.password);

  User.register(new User({username: req.body.username}), req.body.password, function(err) {
    if (err) {
      console.log(err);
      return res.render("register");
    }

    console.log('User registered!');
    res.redirect('/secret');
  });
});

app.get('/login', (req, res) => {
  res.render("login");
});

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/secret');
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
}

app.listen(8080, "localhost", () => 
  console.log(`Server Listening...`)
)
