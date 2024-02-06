const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const passport = require("passport");
const { savedRedirectUrl } = require("../loginmiddleware.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser , (err) => {
        if(err){
          return next(err);
        }
        req.flash("success", "Welcome to CelestiaWander");
        res.redirect("/listing");
      })
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  savedRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success" , "Welcome Back CelestiaWander");
    let redirectUrl = res.locals.redirectUrl || "/listing"; 
    res.redirect(redirectUrl);
  }
);

router.get("/logout",(req,res,next) => {
  req.logOut((err) => {
    if(err){
      return next(err);
    }
    req.flash("success","you are logged out!");
    res.redirect("/listing");
  })
})

module.exports = router;
