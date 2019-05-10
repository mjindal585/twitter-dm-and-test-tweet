var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var session = require('express-session');
var OAuth= require('oauth').OAuth, oa;

function initTwitterOauth() {
    oa = new OAuth(
      "https://twitter.com/oauth/request_token"
    , "https://twitter.com/oauth/access_token"
    , 'sMpAN79OMISk5rNTFgx04gcdcfvgvgvsPY' //token 
    ,  'wau8MISIohJAOgF1Cj9X2vfvgvgbvgvAHIkRYgirSfX8Ez89Q6lVXtEmyJti' //tokensecret
    , "1.0A"
    , "http://localhost:3000/twitter/authn/callback"
    , "HMAC-SHA1"
    );
  }
  
  function makeTweet(cb) {
    oa.post(
      "https://api.twitter.com/1.1/statuses/update.json"
    , '1124595834522202112-Z04lXUS5axsxsxsxsmkg6rdY0Im5Ina8U7Dqv' //token
    , 'IPbTqxp9mng2VUIMleOefoVsITxsxdcfvgvszsxdXts4mohi100T2GrM0vr' //tokensecret
    , {"status": "Tweet & Direct Message using NodeJS  via me . @mjindal585 #success @nodejs @twitter " }
    , cb
    );
  }
  
  function makeDm(sn, cb) {
    oa.post(
      "https://api.twitter.com/1.1/direct_messages/new.json"
    , '1124595834522202112-Z04lXUS5asmkg6rsxsxsxsxsdY0Im5Ina8U7Dqv'
    , 'IPbTqxp9mng2VUIMleOefoVsITXtszssxdxdcd4mohi100T2GrM0vr'
    , {"screen_name": sn, text: "test message via nodejs twitter api. pulled your sn at random, sorry."}
    , cb
    );
  }
  

passport.use(new Strategy({
    consumerKey: 'sMpAN79OMISk5rNTFgx04gsPYzsxsxdxdxd',
    consumerSecret: 'wau8MISIohJAOgF1Cj9X2AHIkRYgirSfX8Ez89Q6lVXtsxxddxsxsxEmyJti',
    callbackURL: 'http://localhost:3000/twitter/return'
    , userAuthorizationURL: 'https://api.twitter.com/oauth/authorize'
}, function(token, tokenSecret, profile, callback) {
    token:'1124595834522202112-Z04lXUS5asmkg6rdY0Im5Ina8U7Dqv';
    tokenSecret:'IPbTqxp9mng2VUIMleOefoVsITXts4mohi100T2GrM0vr';
    initTwitterOauth();
    return callback(null, profile);
}));

passport.serializeUser(function(user, callback) {
    callback(null, user);
})

passport.deserializeUser(function(obj, callback) {
    callback(null, obj);
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'whatever', resave: true, saveUninitialized: true}))

app.use(passport.initialize())
app.use(passport.session())

// 

app.get('/', function(req, res) {
    res.render('index', {user: req.user})
})

app.get('/twitter/login', passport.authenticate('twitter'))

app.get('/twitter/return', passport.authenticate('twitter', {
    failureRedirect: '/'
}), function(req, res) {
    res.redirect('/')
})

app.get('/twitter/tweet', function (req, res) {
    makeTweet(function (error, data) {
      if(error) {
        console.log(require('sys').inspect(error));
        res.end('bad stuff happened');
      } else {
        console.log(data);
        res.end('go check your tweets!');
      }
    });
  });
  app.get('/twitter/direct/:sn', function (req, res) {
    makeDm(req.params.sn, function (error, data) {
      if(error) {
        console.log(require('sys').inspect(error));
        res.end('bad stuff happened (dm)');
      } else {
        console.log(data);
        res.end("the message sent (but you can't see it!");
      }
    });
  });

module.exports = app;
