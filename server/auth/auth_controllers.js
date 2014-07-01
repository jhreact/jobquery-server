'use strict';

var User = require('../user/user_model.js');
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport("SMTP", {
  service: 'Gmail',
  auth: {
    user: global.smtpUsername,
    pass: global.smtpPassword
  }
});

var mailOptions = {
  from: global.fromEmail,
  subject: 'jobQuery Password Reset'
};

module.exports = exports = {

  sendPasswordReset: function(req, res){
    var email = req.body.email;
    User.findOne({email: email}, function(err, user){
      if(err){
        res.send(500);
      } else if (!user){
        res.send(404);
      } else {
        bcrypt.hash('password', null, null, function(err, hash){
          hash = hash.replace(/\.|\/|\$/g, '');
          user.resetHash = hash;
          user.save(function(err){
            var resetLink = global.url + '/reset/' + hash;
            mailOptions.to = email;
            mailOptions.html = '<h1>jobQuery Password Reset</h1><p>You\'re receiving this email because we received a request to reset your password, which you can do by following the link below. If this email was sent in error, you can safely ignore it.</p>' + '<p><a href="' + resetLink + '">Your Reset Link</a></p>';

            smtpTransport.sendMail(mailOptions, function(err, response){
              if(err){
                res.send(500);
              } else {
                console.log('message sent');
                res.send(200);
              }
            });

          });
        });
      }
    });
  },

  resetPassword: function(req, res){
    var password = req.body.password;
    var resetHash = req.body.resetHash;
    User.findOne({resetHash: resetHash}, function(err, user){
      if(err){
        res.send(500);
      } else if (!user) {
        res.send(404);
      } else {
        bcrypt.hash(password, null, null, function(err, hash){
          user.password = hash;
          user.resetHash = null;
          user.save(function(err){
            res.send(200);
          });
        });
      }
    });
  }

};