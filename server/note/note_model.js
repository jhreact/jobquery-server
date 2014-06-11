"use strict";

var mongoose = require('mongoose');

var NoteSchema = new mongoose.Schema({
  content: String,

  title: {
    type: String,
    required: true
  }
});

module.exports = exports = mongoose.model('Note', NoteSchema);