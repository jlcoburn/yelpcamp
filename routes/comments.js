const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment')
//==============================================
// COMMENTS ROUTES
//==============================================


//Comments NEW
router.get("/new", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      res.render("error", {error: err});
    } else {
      res.render("comments/new" , {campground: campground});

    }
  });
});

//Comments CREATE
router.post("/",isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err)
      res.redirect("/campgrounds")
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          res.render("error", {error: err});
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

// COMMENT EDIT ROUTE
router.get("/:comments_id/edit", function (req, res) {
  console.log("in edit route")
   Comment.findById(req.params.comments_id, (err, foundComment) => {
     if (err) {
       console.log(err)
     } else {
      console.log(foundComment);
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})
     }
  })
})



//update campground route
router.put("/:comment_id", (req, res)=> {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err) {
      res.render("error", {error: err});
    } else {
      res.redirect("/campgrounds/" + req.params.id);
  }
})
});

router.delete("/:comment_id",  (req,res)=> {
  Comment.findByIdAndRemove(req.params.comment_id, (err) =>{
    if (err) {
      res.render("error", {error: err})
    } else {
      res.redirect("/campgrounds/" + req.params.id)
    }
  })
})


//Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

// function checkCommentOwnership(req, res, next) {
//   if (req.isAuthenticated()) {
//     Comment.findById(req.params.id, (err, foundCampground) =>{
//       if (err) {
//         res.redirect("back")
//       } else {
//         if (foundCampground.author.id.equals(req.user.id)) {
//          next();
//         } else {
//           res.redirect("back");
//         }
//       }
//     });

//   } else {
//     res.redirect("back");
//   }
// }



module.exports = router;