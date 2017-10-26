var express = require('express');
var router = express.Router();
const graphHelper = require('../util/graphWorker.js');
const passport = require('passport');
var tokens = "";

router.get('/',(req,res)=>{
  if(!req.isAuthenticated()){
    res.render('login');
  }else{
    console.log('hi');
    showAuthCode(req,res);
  }
});

router.get('/login',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/');
});

router.get('/token',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
    (req, res) => {
      tokens = req.user.accessToken;

      graphHelper.getUserData(req.user.accessToken, (err, user,token) => {
        if (!err) {
          tokens = req.user.accessToken;
          req.user.profile.displayName = user.body.displayName;
          req.user.profile.emails = [{ address: user.body.mail || user.body.userPrincipalName }];
          showAuthCode(req, res);
        } else {
          renderError(err, res);
        }
      });
    });
function showAuthCode(req, res) {
  res.render('showAuthCode', {
    token: tokens,
    display_name: req.user.profile.displayName,
    email_address: req.user.profile.emails[0].address
  });
}
function renderError(e, res) {
  e.innerError = (e.response) ? e.response.text : '';
  res.render('error', {
    error: e
  });
}
module.exports = router;
