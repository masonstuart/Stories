const express = require("express");
const { ensureGuest, ensureAuth } = require("../middleware/auth");
const router = express.Router();

const Story = require('../models/story')

// login/landing page
//GET to /
router.get("/", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});
// dashboard
//GET to /dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
  try{
    const stories = await Story.find({ user: req.user.id }).lean()
    res.render("dashboard", {
      name:req.user.firstName,
      stories
    })
  } catch(err){
    res.render('error/500')
  }
});
module.exports = router;
