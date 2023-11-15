const express = require('express');
const isLoggedIn = require('../middleware/isLoggedIn');
const isLoggedOut = require('../middleware/isLoggedOut');
const router = express.Router();

/* GET home page */
router.get("/", /* isLoggedIn, isLoggedOut,  */(req, res, next) => {
  let data = {
    layout: false
  }
  if(req.session.currentUser){
    res.redirect("auth/feed"); 
  } else{
    res.render("index", data);
  }

});

module.exports = router;