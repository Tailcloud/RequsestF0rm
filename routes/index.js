var express = require('express');
var router = express.Router();
const graphHelper = require('../util/graphWorker.js');
const passport = require('passport');
var tokens = "";
/*new for db*/
var config = require("../util/config");

var documentClient = require('documentdb').DocumentClient;
var client = new documentClient(config.endpoint,{"masterKey":config.primaryKey});
var databaseUrl = `dbs/${config.database.id}`;
var collectionUrl = `${databaseUrl}/colls/${config.collection.id}`;
var authCode ="";
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
function exit(message) {
    console.log(message);
    console.log('Press any key to exit');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
}

getDatabase()
.then(() => getCollection())
.then(() => getFamilyDocument(config.documents.Andersen))
.then(() => getFamilyDocument(config.documents.Wakefield))
.then(() => { exit(`Completed successfully`); })
.catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });

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
}
function renderError(e, res) {
  e.innerError = (e.response) ? e.response.text : '';
  res.render('error', {
    error: e
  });
}
function getDatabase() {
    console.log(`Getting database:\n${config.database.id}\n`);

    return new Promise((resolve, reject) => {
        client.readDatabase(databaseUrl, (err, result) => {
            if (err) {
                if (err.code == "404") {
                    client.createDatabase(config.database, (err, created) => {
                        if (err) reject(err)
                        else resolve(created);
                    });
                } else {
                    reject(err);
                }
            } else {
                resolve(result);
            }
        });
    });
}
function getCollection() {
    console.log(`Getting collection:\n${config.collection.id}\n`);

    return new Promise((resolve, reject) => {
        client.readCollection(collectionUrl, (err, result) => {
            if (err) {
                if (err.code == "404") {
                    client.createCollection(databaseUrl, config.collection, { offerThroughput: 400 }, (err, created) => {
                        if (err) reject(err)
                        else resolve(created);
                    });
                } else {
                    reject(err);
                }
            } else {
                resolve(result);
            }
        });
    });
}
function getFamilyDocument(document) {
    let documentUrl = `${collectionUrl}/docs/${document.id}`;
    console.log(`Getting document:\n${document.id}\n`);

    return new Promise((resolve, reject) => {
        client.readDocument(documentUrl, { partitionKey: document.district }, (err, result) => {
            if (err) {
                if (err.code == "404") {
                    client.createDocument(collectionUrl, document, (err, created) => {
                        if (err) reject(err)
                        else resolve(created);
                    });
                } else {
                    reject(err);
                }
            } else {
                resolve(result);
            }
        });
    });
};
module.exports = router;
