var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  = require('../models/campground');
var Comment     = require('../models/comment');
var middleware = require('../middleware');



// Comments new
router.get("/new", middleware.isLogedIn, function(req, res) { //isLogedIn check when we click on add coment, if user is loged in
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
});
// Comments create
router.post("/", middleware.isLogedIn, function(req,res){
    
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            console.log(req.body.comment);// uzima podatke iz comment[author] i comment[text]
            Comment.create(req.body.comment,function(err,comment){
                
                if(err)
                {
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                }
                else
                {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                 
                    //save comment
                    comment.save();
                    
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    req.flash("success", "Successfully added comment!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    })
    
});

//COMMENT EDIT ROUTE

router.get("/:comment_id/edit",  middleware.checkCommentsOwnership ,function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back");
        } else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
  
});

//COMMENT UPDATE
   
router.put("/:comment_id", middleware.checkCommentsOwnership,function(req,res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else{
           res.redirect("/campgrounds/" + req.params.id );
       }
    });
    
});

//COMMENT DESTROY ROUTE

router.delete("/:comment_id", middleware.checkCommentsOwnership, function(req,res){
    //fing by i and remove
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Comment deleted ");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

module.exports = router;