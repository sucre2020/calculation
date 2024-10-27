const express = require("express");
const passport = require("passport");
const router = express.Router();

// Home route
router.get("/", (req, res) => {
  res.render("index");
});

// Google login
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect to calculation page.
    res.redirect("/calculate");
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Dashboard
router.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("dashboard", { user: req.user });
});

module.exports = router;
