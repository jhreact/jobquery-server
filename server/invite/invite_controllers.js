"use strict";

var User = require('./../user/user_model.js');
var Tag = require('./../tag/tag_model.js');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');

var smtpTransport = nodemailer.createTransport("SMTP", {
  service: 'Gmail',
  auth: {
    user: 'jobquerytest@gmail.com',
    pass: '2p1XoftiuEN8'
  }
});

var mailOptions = {
  from: 'jobquerytest@gmail.com',
  subject: 'Invitation to jobQuery'
};

var sendInvites = function(req, res){
  var emails = req.body;
  var alreadyRegistered = false;
  var emailsAlreadyRegistered = [];
  // check if emails already taken
  User.find(function (error, users) {
    users.forEach(function(item, index, users){
      if(emails.indexOf(item.email) >= 0){
        alreadyRegistered = true;
        emailsAlreadyRegistered.push(item.email);
      }
    });

    if (alreadyRegistered) {
      res.send(200, emailsAlreadyRegistered);
    } else {
      createUsers(emails, function(email, password){
        mailOptions.to   = email;
        mailOptions.html = '<div>username: ' + email + '</div>' + '<div> password: ' + password +
        '</div><div><a href="http://jobby.azurewebsites.net/login">Login</a></div>';
        smtpTransport.sendMail(mailOptions, function(error, response){
          if(error){
            console.log(error);
          } else {
            console.log('Message sent: ' + response.message);
          }
        });

        res.send(202);
      });
    }
  });
};

var generatePassword = function() {
    var length = 8,
        charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
};

var createUsers = function(emails, callback) {
  Tag.find(function(error, tags) {
    var userTags = [];
    // tags have to be populated on every new user
    userTags = tags.map(function(item){
      var tag = {
        tag: item._id,
        value: null
      };
      return tag;
    });
    emails.forEach(function(email) {
      var password = generatePassword();
      bcrypt.hash(password, null, null, function(err, hash){
        User.create({
          email:     email,
          password:  hash,
          isAdmin:   false,
          tags:      userTags
        }).then( function(user) {
          callback(email, password);
         }, function(err){
           console.log(err);
        });
      });
    });
  });
};

module.exports = exports = {
  sendInvites: sendInvites
};
