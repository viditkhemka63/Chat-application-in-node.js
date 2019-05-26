var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../model/user');

router.get('/login', (req, res) => {
  res.render('login.ejs');
})

router.post('/login', passport.authenticate('local-login',{
  successRedirect : '/profile',  
  failureRedirect : '/login'
}));



router.get('/signup', (req, res) => {
  res.render('signup.ejs');
})

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/profile', // redirect to the secure profile section
  failureRedirect : '/signup',
}))


var Room = require('../model/room');

router.get('/profile', isLoggedIn, function(req, res) {

  Room.find({}, (err, doc) => {
    if(err) throw err;

    console.log('before rooms name');
    console.log(doc);
    res.render('profile.ejs', {
      user : req.user,
      rooms: doc
    });
  })
  //console.log(req.user);
  
});


router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
      return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

module.exports = router;
