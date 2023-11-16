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

    const findPost = Foodpost.find({ creator: user._id })
        .populate("requestedBy")


    const findUser = User.findById(user._id)
        .populate("requestedTuppers")

    Promise.all([findPost, findUser])
        .then((values) => {
            // res.send(values[1])
            res.render("user/user-profile", { userPosts: values[0], userRequests: values[1].requestedTuppers });
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

    const updatedUser = req.body;
    let newProfilePicture = userToUpdate.profilePicture
    let newBio = userToUpdate.bio
    let newLocation = userToUpdate.location

    //Verify if a new image file was uploaded
    if (req.file) {
        newProfilePicture = req.file.path
    } else if (!req.file) {
        newProfilePicture = userToUpdate.profilePicture
    }

    if (updatedUser.bio) {
        newBio = updatedUser.bio
    } else if (!updatedUser.bio) {
        newProfilePicture = userToUpdate.profilePicture
    }

    if (updatedUser.location) {
        newLocation = updatedUser.location
    } else if (!updatedUser.location) {
        newProfilePicture = userToUpdate.profilePicture
    }

    User.findByIdAndUpdate(
        userToUpdate._id,
        { bio: updatedUser.bio, location: updatedUser.location, profilePicture: newProfilePicture },
        { new: true })
        .then((userUpdated) => {
            console.log(userUpdated);
            req.session.currentUser = userUpdated
            res.redirect("/user/user-profile")
        })
        .catch((error) => console.log("error!!", error));

});

module.exports = router;