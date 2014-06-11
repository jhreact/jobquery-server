"use strict";

var mongoose = require('mongoose');

var opportunitySchema = mongoose.Schema({
  company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true},
  tags: 
    [{
      tagId: {type: mongoose.Schema.Types.ObjectId, ref: 'Tag'},
      score: {type: Number, min: 1, max: 4}
    }],
  active: {type: Boolean, default: true, required: true},
  title: {type: String, required: true},
  notes:
    [{
      date: {type: Date, default: Date.now},
      text: String
    }],
  internalNotes: 
    [{
      date: {type: Date, default: Date.now},
      text: String
    }],
  description: {type: String, required: true},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
});

module.exports = exports = mongoose.model('Opportunity', opportunitySchema); 