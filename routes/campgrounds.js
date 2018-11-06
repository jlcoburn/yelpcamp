const express = require('express');
const router = express.Router();
const Campground = require('../models/campground')


//Index
router.get("/", (req, res) => {

  Campground.find({}, function (err, campgrounds) {
    if (err) { 
      res.render("error", {error: err});
    } else {  
      res.render("campgrounds/index", {campgrounds: campgrounds});
    }
  })
})

//CREATE route
router.post("/", isLoggedIn, (req, res) => {
  const name= req.body.name;
  const image=req.body.image;
  const desc = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username
  }
  const newCampground= {name: name, image: image, description: desc, author: author}
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      res.render("error", {error: err});
    } else {
      res.redirect("/campgrounds");
    }
  })
})


//NEW route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new")
})

//SHOW -- show more info about one campground
router.get("/:id", (req, res)=>{
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if(err) {
      res.render("error", {error: err});
    } else {
      res.render("campgrounds/show", {campground: foundCampground})

    }
  });
  
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;