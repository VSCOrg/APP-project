const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const User = require("../models/User.model");
const Foodpost = require("../models/Foodpost.model");

const fileUploader = require('../config/cloudinary.config');

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// GET /post/post-create
router.get("/post-create", isLoggedIn, (req, res) => {
    const displayHome = true
    const displayProfileButton = true
    res.render("post/post-create", {displayHome, displayProfileButton});

});


const dateOptions = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
/// POST CREATE
router.post("/post-create", isLoggedIn, fileUploader.single('foodImage'), (req, res) => {
    const user = req.session.currentUser
    const postCreated = req.body
    
    //const dayFormated = new Date(postCreated.expiringDate)
    //console.log(dayFormated.getDay());
    Foodpost.create({
        title: postCreated.title,
        foodImage: req.file.path,
        description: postCreated.description,
        expiringDate: new Date(postCreated.expiringDate).toLocaleDateString('en-EN', dateOptions), 
        pickUpTime: postCreated.pickUpTime,
        pickUpPlace: postCreated.pickUpPlace,
        foodType: postCreated.foodType,
        alergies: postCreated.alergies,
        creator: user._id
    })

        .then((newFoodPost) => {
            return User.findByIdAndUpdate(user._id, { $push: { foodPosts: newFoodPost._id } })  
        })
        .then((userUpdated) => {
            //console.log(userUpdated)
            res.redirect("/auth/feed");   //slash needed wehn redirecting
        })
        .catch((error) => {
            console.log("error creating post", error);
            res.status(500).send("Internal server error amigo")
        })
});

// GET /post/post-edit
router.get("/post-edit", isLoggedIn, (req, res) => {
    res.render("post/post-edit");
});




// GET /post/post
router.get("/post",isLoggedIn, (req, res) => {
    res.render("post/post");
});


//Post / tupper-request
router.post("/tupper-request", isLoggedIn, (req, res) => {
    const { postId } = req.body
    const user = req.session.currentUser
    const requested = true

    Foodpost.findByIdAndUpdate(postId,
        { requested: true, requestedBy: user._id },
        { new: true })

        .then((tupperRequested) => {
            console.log(tupperRequested)
        })
        .catch((error) => {
            console.log("error updating tupper requested post", error);
            res.status(500).send("Internal server error amigo")
        })


    User.findByIdAndUpdate(user._id, { $push: { requestedTuppers: postId } })
        .then((userUpdated) => {
            // console.log(userUpdated);
            res.redirect("/user/user-profile")
        })
        .catch((error) => {
            console.log("error creating post", error);
            res.status(500).send("Internal server error amigo")
        })
});

router.post("/tupper-to-delete", isLoggedIn, (req, res) => {
    const { postId } = req.body

    Foodpost.findById(postId)
        .then((deliveredPost) => {
            console.log(deliveredPost)
            return Foodpost.deleteOne(deliveredPost)

        })
        .then((deletedPost) => {
            res.redirect("/user/user-profile")
        })
        .catch((error) => {
            console.log("error delivering post", error);
            res.status(500).send("Internal server error amigo")
        })
})

module.exports = router;
