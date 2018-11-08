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

router.get("/:id/edit", checkCampgroundOwnership, function (req, res) {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render("campgrounds/edit", {campground: foundCampground})
  })
})



//update campground route
router.put("/:id", checkCampgroundOwnership, (req, res)=> {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    if (err) {
      res.render("error", {error: err});
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
});

//DESTROY campground route
router.delete("/:id", checkCampgroundOwnership, (req,res)=> {
  Campground.findByIdAndRemove(req.params.id, (err) =>{
    if (err) {
      res.render("error", {error: err})
    } else {
      res.redirect("/campgrounds")
    }
  })
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

function checkCampgroundOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) =>{
      if (err) {
        res.redirect("back")
      } else {
        if (foundCampground.author.id.equals(req.user.id)) {
         next();
        } else {
          res.redirect("back");
        }
      }
    });

  } else {
    res.redirect("back");
  }
}

module.exports = router;