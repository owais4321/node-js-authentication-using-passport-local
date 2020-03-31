const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (
      email,
      password,
      done
    ) =>{
        console.log(password);
      User.findOne({ email: email })
      .then(user=>{
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }
        //password matching
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
      });
      })
    })
  );
  passport.serializeUser((user, done)=> {
    done(null, user.id);
  });
  passport.deserializeUser((id, done)=> {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
