const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const User = require("../models/User.model");
const Foodpost = require("../models/Foodpost.model");

const fileUploader = require('../config/cloudinary.config');

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// Get user infos and display them
router.get("/user-profile", (req, res) => {
    const user = req.session.currentUser
   
        Foodpost.find({creator: user._id})
        .then((userPosts) =>{
            console.log(userPosts)
            res.render("user/user-profile", {user, userPosts });
            
        })

});


//display page edit user

router.get("/user-edit", (req, res) => {
    const user = req.session.currentUser
    res.render("user/user-edit", user)
});


// edit user
router.post("/user-edit", fileUploader.single('profilePicture'), (req, res) => {
    const userToUpdate = req.session.currentUser
    //console.log("ciao", userToUpdate);
    const updatedUser = req.body;
    //console.log("hello", updatedUser);
    const profilePicture = req.file.path

    
        User.findByIdAndUpdate(
            userToUpdate._id, 
            { /* bio: updatedUser.bio, location: updatedUser.location, */ profilePicture: req.file.path }, 
            { new: true })
            .then((userUpdated) => {
                console.log(userUpdated);
                req.session.currentUser = userUpdated
                res.redirect("/user/user-profile")
            })
            .catch((error) => console.log("error!!", error));
 

});

module.exports = router;