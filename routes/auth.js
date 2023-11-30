const express = require('express');
const passport = require('passport');
const router = express.Router();
// auth with google
//GET to /auth/google

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// google auth callback
//GET to /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// Logout
router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});
// router.get('/logout', (req,res)=>{
//     req.logOut()
//     res.redirect('/')
// })
module.exports = router;
