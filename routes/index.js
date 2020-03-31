// required imports 
const express = require("express");
const router = express.Router();
const { ensureAuthenticated,forwardAuthenticated } = require("../config/auth");
//if user is logged in show dashboard otherwise welcome
router.get("/",forwardAuthenticated ,(req, res) => res.render("welcome"));
//dashboard route with check if user is authenticated or not
router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashboard", {
    name: req.user.name
  })
);
//export module
module.exports = router;