var request = require('request');
var bcrypt = require('bcrypt-nodejs');
// var session = require('express-session');

exports.getUrlTitle = function(url, cb) {
  request(url, function(err, res, html) {
    if (err) {
      console.log('Error reading url heading: ', err);
      return cb(err);
    } else {
      var tag = /<title>(.*)<\/title>/;
      var match = html.match(tag);
      var title = match ? match[1] : url;
      return cb(err, title);
    }
  });
};

var rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

exports.isValidUrl = function(url) {
  return url.match(rValidUrl);
};


/************************************************************/
// Add additional utility functions below
/************************************************************/

exports.checkUserSession = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

exports.comparePassword = (req, res, user, found, next) => {
  console.log(found);
  var hash = bcrypt.hashSync(req.body.password);
  bcrypt.compare(req.body.password, found.attributes.password, function(err, result) {
    if (result) {
      next(req, res, user);
    } else {
      console.log('wrong password');
      res.redirect('/login');
    }
  });
};

exports.createSession = (req, res, user) => {
  req.session.regenerate(function(err) {
    if (err) throw err;
    req.session.user = user;
    res.redirect('/');
  });
};
