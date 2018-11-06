const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport');
const LocalStrategy = require('passport-local')


const commentRoutes = require('./routes/comments')
const campgroundRoutes = require('./routes/campgrounds');
const authRoutes = require('./routes/auth')

const app = express();
mongoose.connect("mongodb://localhost:27017/yelpcamp", {useNewUrlParser: true})
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
console.log(__dirname + "/public")
const Comment   = require("./models/comment");
const Campground = require('./models/campground');
const User = require('./models/user');


//Passport Configuration

app.use(require("express-session")({
  secret: "Merry and Pippin are great",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
})

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes)



app.listen(3000, () => {
  console.log("Yelpcamp running on port 3000");
});