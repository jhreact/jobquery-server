"use strict";

var mongoose = require('mongoose');

var opportunitySchema = mongoose.Schema({
  active:       {type: Boolean, default: true, required: true},
  title:        {type: String, required: true},
  description:  {type: String, required: true},
  tags:
    [{
      tagId: {type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: true},
      score: {type: Number, min: 1, max: 4, required: true}
    }],
  links:
    [{
      date: {type: Date, required: true, default: Date.now},
      url:  {type: String, required: true}
    }],
  notes:
    [{
      date: {type: Date, required: true, default: Date.now},
      text: {type: String, required: true}
    }],
  internalNotes:
    [{
      date: {type: Date, required: true, default: Date.now},
      text: {type: String, required: true}
    }],
  questions:
    [{
      date: {type: Date, required: true, default: Date.now},
      question: {type: String, required: true}
    }],
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
});

module.exports = exports = mongoose.model('Opportunity', opportunitySchema);
