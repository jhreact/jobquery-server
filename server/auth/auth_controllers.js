'use strict';

var User = require('../user/user_model.js');
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');

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
            var resetLink = 'http://localhost:8000/reset/' + hash;
            mailOptions.to = email;
            mailOptions.html = '<a href="' + resetLink + '">Your Reset Link</a>'

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