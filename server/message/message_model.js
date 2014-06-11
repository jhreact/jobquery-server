"use strict";

var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
  from: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  to: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  text: {type: String, required: true},
  createdAt: {type: Date, default: Date.now}
});

module.exports = exports = mongoose.model('Message', messageSchema);