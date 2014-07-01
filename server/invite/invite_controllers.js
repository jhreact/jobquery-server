"use strict";

var User = require('./../user/user_model.js');
var Tag = require('./../tag/tag_model.js');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');

var smtpTransport = nodemailer.createTransport("SMTP", {
  service: 'Gmail',
  auth: {
    user: global.smtpUsername,
    pass: global.smtpPassword
  }
});

var mailOptions = {
  from: global.fromEmail,
  subject: 'Invitation to jobQuery'
};

var sendInvites = function(req, res){
  var category = req.body.category;
  var emails = req.body.emails;
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
      createUsers(emails, category, function(email, password){
        mailOptions.to   = email;
        mailOptions.html = '<h1>Welcome to jobQuery!</h1><p>You\'re received an invite to jobQuery, an exclusive platform connecting Hack Reactor grads and alums to job opportunities managed by our hiring team. </p><p>Below are your temporary login credentials - Please login, change your password and create your profile. Then check out each of the available job opportunities and declare your interest level. Check back regularly - things change often!</p><p>Have questions? Encountered a bug? Have an idea on how we can improve the platform? Email the hiring team at hire@hackreactor.com.</p><p>Happy hunting!</p><p>- The Hack Reactor Hiring Team</p><div>username: ' + email + '</div><div> password: ' + password + '</div><div><a href="' + global.url + '/login">Login</a></div>';
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

var createUsers = function(emails, category, callback) {
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
        var userParams = {
          email:     email,
          password:  hash,
          isAdmin:   false,
          tags:      userTags
        };
        if(category) userParams.category = category;
        User.create(userParams).then( function(user) {
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
