const express = require("express");
const bcrypt = require("bcryptjs");
const passport=require('passport');
const router = express.Router();
const { forwardAuthenticated } =require("../config/auth");
const User = require("../models/User");
//register page
router.get("/register",forwardAuthenticated, (req, res) => res.render("registration"));
//login page
router.get("/login",forwardAuthenticated ,(req, res) => res.render("login"));
//register handle
router.post("/register", (req, res) => {
  //validations
  const { name, email, password, password2 } = req.body;
  errors = [];
  //validation for checking empty
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "please fill all the fields" });
  }
  //check if password and confirm password are same
  if (password != password2) {
    errors.push({ msg: "Password don't match" });
  }
  //check if length of password is equal or greater then 6
  if (password.length < 6) {
    errors.push({ msg: "password must be more then 6 digit" });
  }
  //check if there are errors
  if (errors.length > 0) {
    //show registration page with errors and field values
    res.render("registration", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    //validation is passed find if user already exists
    User.findOne({ email: email }).then(user => {
      //if user already exists
      if (user) {
        errors.push({ msg: "user already existed" });
        res.render("registration", {
          errors,
          name,
          email,
          password,
          password2
        });
        //if user doesn't exists
      } else {
        //create new user
        const newuser = new User({
          name,
          email,
          password
        });
        //encrypt password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newuser.password, salt, (err, hash) => {
            if (err) console.log(err);
            //set encrypted password
            newuser.password = hash;
            console.log(newuser);
            newuser
            //save user
              .save()
              .then(user => {
                //set flash message for success registration
                req.flash("success_msg", "You are successfully Registered");
                res.redirect("/user/login");
              })
              .catch(err => console.log(err));
          })
        );
      }
    });
  }
});

//login handle
router.post('/login',(req,res,next)=>{
//using passport to authenticate user
passport.authenticate('local',{
  successRedirect:'/dashboard',
  failureRedirect:'/user/login',
  failureFlash:true,
})(req,res,next);
});

//logout handler
router.get('/logout',(req,res)=>{
  req.logout();
  req.flash("success_msg","You're successfully logged out");
  res.redirect("/user/login");
});

module.exports = router;
