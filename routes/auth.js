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
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash("error", err.message)
      return res.redirect("register")
    }
    
    passport.authenticate("local")(req, res, function() {
      req.flash("success", "Welcome to YelpCamp " + user.username)
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
  req.flash("success", "Logged you out.")
  res.redirect("/campgrounds");
})


module.exports = router;