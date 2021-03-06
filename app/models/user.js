var db = require('../config');
var Promise = require('bluebird');
var Link = require('./link');
var bcrypt = require('bcrypt-nodejs');


var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  links: function() {
    return this.hasMany(Link);
  },
  initialize: function() {
    // this.on('creating', function(model, attrs, options) {
    //   var hash = bcrypt.hashSync(model.get('password'));
    //   model.set('password', hash);
    // });
  },
});


module.exports = User;