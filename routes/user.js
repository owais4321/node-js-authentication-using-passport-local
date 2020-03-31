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
  const { name, email, password, password2 } = req.body;
  errors = [];
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "please fill all the fields" });
  }
  if (password != password2) {
    errors.push({ msg: "Password don't match" });
  }
  console.log(password.length);
  if (password.length < 6) {
    errors.push({ msg: "password must be more then 6 digit" });
  }

  if (errors.length > 0) {
    console.log(errors);
    res.render("registration", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    //validation is passed
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: "user already existed" });
        res.render("registration", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newuser = new User({
          name,
          email,
          password
        });
        console.log("else route ");
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newuser.password, salt, (err, hash) => {
            if (err) console.log(err);
            newuser.password = hash;
            console.log(newuser);
            newuser
              .save()
              .then(user => {
                req.flash("success_msg", "You are successfully login");
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
