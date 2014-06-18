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
  subject: 'Test Subject'
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
      res.send(403, emailsAlreadyRegistered);
    } else {
      createUsers(emails, function(){
        for(var i = 0; i < emails.length; i++){
          mailOptions.to   = emails[i];
          mailOptions.text = 'username:' + emails[i] + ' ' + 'password:password';
          smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
              console.log(error);
            } else {
              console.log('Message sent: ' + response.message);
            }
          });
        }
        res.send(202);
      });
    }
  });
};

var createUsers = function(emails, callback) {
  Tag.find(function(error, tags){
    var user_tags = [];
    // tags have to be populated on every new user
    user_tags = tags.map(function(item){
      var tag = {
        tagId : item._id,
        score : 0
      };
      return tag;
    });
    emails.forEach(function(email) {
      var firstTimePassword = 'password';

      bcrypt.hash(firstTimePassword, null, null, function(err, hash){
       User.create({
         email:     email,
         password:  hash,
         isAdmin:   false,
         tags:      user_tags

       }).then(function(user) {
           callback();
         }, function(err){
         });
      });

    });
  });
};

module.exports = exports = {
  sendInvites: sendInvites
};
