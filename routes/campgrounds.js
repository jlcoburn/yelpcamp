const express = require('express');
const router = express.Router();
const Campground = require('../models/campground')
const middleware = require('../middleware/index')


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
router.post("/", middleware.isLoggedIn, (req, res) => {
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
router.get("/new", middleware.isLoggedIn, (req, res) => {
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

router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render("campgrounds/edit", {campground: foundCampground})
  })
})



//update campground route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res)=> {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    if (err) {
      res.render("error", {error: err});
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
});

//DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, (req,res)=> {
  Campground.findByIdAndRemove(req.params.id, (err) =>{
    if (err) {
      res.render("error", {error: err})
    } else {
      res.redirect("/campgrounds")
    }
  })
})





module.exports = router;