"use strict";

var mongoose = require('mongoose');

var MessageSchema = mongoose.Schema({
  from: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  to: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  body: String,
  createdAt: {type: Date, default: Date.now}
});

module.exports = exports = mongoose.model('Message', MessageSchema);