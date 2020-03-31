//required imports
const express = require("express");
const app = express();
const ejslayout = require("express-ejs-layouts");
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport =require("passport");

//passport config
require("./config/passport")(passport);

//db connection
var db = require("./config/keys").MongoURI;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("database connected"))
  .catch(err => console.log(err));
//ejs
app.use(ejslayout);
app.set("view engine", "ejs");

//express session
app.use(
  session({
    secret: "secret key",
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
//connec-flash
app.use(flash());

//creating global variable
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//body parser
app.use(express.urlencoded({ extended: false }));

//router
app.use("/", require("./routes/index"));
app.use("/user", require("./routes/user"));
app.listen(PORT, () => {
  console.log(`listening to port number ${PORT}`);
});
