"use strict";

var mongoose = require('mongoose');

var tagSchema = mongoose.Schema({
  name: String,
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
});

module.exports = exports = mongoose.model('Tag', tagSchema); 