"use strict";

var mongoose = require('mongoose');

var opportunitySchema = mongoose.Schema({
  company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
  tags: 
    [{
      tagId: {type: mongoose.Schema.Types.ObjectId, ref: 'Tag'},
      score: {type: Number, min: 1, max: 4}
    }],
  active: {type: Boolean, default: true},
  title: String,
  notes:
    [{
      date: Date,
      text: String
    }],
  internalNotes: 
    [{
      date: Date,
      text: String
    }],
  description: String,
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
});

module.exports = exports = mongoose.model('Opportunity', opportunitySchema); 