//this file contains passport strategy we have used local strategy in this case
//required imports
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
//creating local authentication using local strategy
module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      console.log(password);
      //check if user exists
      User.findOne({ email: email }).then(user => {
        if (!user) {
          //show error user doesnot exists
          return done(null, false, { message: "That email is not registered" });
        }
        // if user exist now lest do password matching we have hashed password we have to use 
        //bcrypt
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            //if passwords matches
            return done(null, user);
          } else {
            //if password doesn't match
            return done(null, false, { message: "Password incorrect" });
          }
        });
      });
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
