const express = require('express');
const router = express.Router();
const Campground = require('../models/campground')

router.get("/", (req, res) => {

  Campground.find({}, function (err, campgrounds) {
    if (err) { 
      res.render("error", {error: err});
    } else {  
      res.render("campgrounds/index", {campgrounds: campgrounds});
    }
  })
})

router.post("/", (req, res) => {
  const name= req.body.name;
  const image=req.body.image;
  const desc = req.body.description;
  const newCampground= {name: name, image: image, description: desc}
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      res.render("error", {error: err});
    } else {
      res.redirect("/campgrounds");
    }
  })
})

router.get("/new", (req, res) => {
  res.render("campgrounds/new")
})

//Show -- show more info about one campground
router.get("/:id", (req, res)=>{
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if(err) {
      res.render("error", {error: err});
    } else {
      res.render("campgrounds/show", {campground: foundCampground})

    }
  });
  
});

module.exports = router;