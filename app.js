const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport');
const LocalStrategy = require('passport-local')
const methodOverride = require('method-override');
const flash = require('connect-flash');


const commentRoutes = require('./routes/comments')
const campgroundRoutes = require('./routes/campgrounds');
const authRoutes = require('./routes/auth')

const app = express();
mongoose.connect("mongodb://localhost:27017/yelpcamp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash())

const Comment   = require("./models/comment");
const Campground = require('./models/campground');
const User = require('./models/user');

// const seedDB = require('./seeds')
// seedDB();

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
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
})

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes)



app.listen(3000, () => {
  console.log("Yelpcamp running on port 3000");
});