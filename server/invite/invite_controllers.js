"use strict";

var User = require('./../user/user_model.js');
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
  subject: 'Test Subject',
  text: 'Test Text'
};

var sendInvites = function(req, res){
  var emails = req.body.emails;
  for(var i = 0; i < emails.length; i++){
    mailOptions.to = emails[i];
    smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
        console.log(error);
      } else {
        console.log('Message sent: ' + response.message);
      }
    });
  };
  res.send(202);
};

module.exports = exports = {
  sendInvites: sendInvites
};
