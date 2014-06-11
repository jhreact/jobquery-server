"use strict";

var mongoose = require('mongoose');

var noteSchema = new mongoose.Schema({
  content: String,
  title: {
    type: String,
    required: true
  }
});

module.exports = exports = mongoose.model('Note', noteSchema);