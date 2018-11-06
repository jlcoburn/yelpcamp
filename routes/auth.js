const express = require('express');
const router = express.Router();
const passport= require('passport');
const User = require('../models/user')



//Root Route
router.get("/", (req, res) => {
  res.render("landing", {currentUser: req.user})
})



//================================
// Auth Routes
//================================


//Register route
router.get("/register", (req, res) =>{
  res.render("register")
});


//Register Form
router.post("/register", (req, res) => {
  const newUser = new User({username: req.body.username});
  console.log('about to add user')
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log('Problem registering new account: ', err)
      return res.render("error", {error: err})
    }
    
    passport.authenticate("local")(req, res, function() {
      console.log('redirecting');
      res.redirect('/campgrounds');
    });
  });
});


//Login Route
router.get("/login", (req,res) => {
  res.render("login");
})


//Handle Login
router.post("/login", passport.authenticate("local", {successRedirect: "/campgrounds", failureRedirect: "/login"}), (req, res) => {});

//Logout
router.get("/logout", (req,res) =>{
  req.logout();
  res.redirect("/campgrounds");
})


//Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;