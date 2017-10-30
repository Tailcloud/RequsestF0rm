var express = require('express');
var router = express.Router();
const graphHelper = require('../util/graphWorker.js');
const passport = require('passport');
var tokens = "";
/*new for db*/
var MongoClient = require("mongodb").MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/requestf0rmdb';

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
      authCode = rand(4);
      console.log('......eiwou4t;g      '+authCode);
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

function rand(m) {
  m = m > 16 ? 16 : m;
  var num = Math.random().toString();
  if(num.substr(num.length - m, 1) === '0') {
  return rand(m);
  }
  return num.substring(num.length - m);
}
function showAuthCode(req, res) {
  res.render('showAuthCode', {
    token: tokens,
    authcode: authCode,
    display_name: req.user.profile.displayName,
    email_address: req.user.profile.emails[0].address
  });
  MongoClient.connect(url, function(err, db) {
  assert.equal(null,err);
  console.log("connected correctly to server");

  var rscols = db.collection("users");
  // var cursor = events.find({"token":token});
  rscols.find({"token":tokens}).toArray(function(err, items) {
        if (err) {
          console.log(err);
          res.status(500).send();
        } else if(items.length==0){
          rscols.insert({
                  "token":tokens,
                  "AuthCode": authCode,
                  "name": req.user.profile.displayName,
                  "email": req.user.profile.emails[0].address
                  },function(err,docs){
                    if(err){
                      db.close();
                      console.log("Data inserted failed:"+err);
                    }else{
                      console.log("Data inserted successfully:"+docs)
                    }
                });
          res.status(200).send();
        }else{
          console.log(items[0].password);
          res.status(409).send();

        }
      });
});
}
function renderError(e, res) {
  e.innerError = (e.response) ? e.response.text : '';
  res.render('error', {
    error: e
  });
}
module.exports = router;
