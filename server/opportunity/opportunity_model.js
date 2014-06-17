'use strict';

var mongoose = require('mongoose');

var mongoOID = mongoose.Schema.Types.ObjectId;

var opportunitySchema = new mongoose.Schema({
  active:       {type: Boolean, default: true, required: true},
  company:      {type: mongoOID, ref: 'Company', required: true, index: true},
  jobTitle:     {type: String, required: true},
  description:  {type: String, required: true},
  tags:
    [{
      tagId:    {type: mongoOID, ref: 'Tag', required: true},
      score:    {type: Number, min: 0, max: 4, required: true}
    }],
  links:
    [{
      title:    {type: String, required: true},
      url:      {type: String, required: true}
    }],
  notes:
    [{
      date:     {type: Date, required: true, default: Date.now},
      text:     {type: String, required: true}
    }],
  internalNotes:
    [{
      date:     {type: Date, required: true, default: Date.now},
      text:     {type: String, required: true}
    }],
  questions:
    [{
      date:     {type: Date, required: true, default: Date.now},
      question: {type: String, required: true}
    }],
  survey:
    [{
      userId:   {type: mongoOID, ref: 'User', required: true},
      salary:   {type: Number},
      notes:    {type: [String]},
      stage:
        {
          type: String,
          enum:
            [
              'Offer Accepted',
              'Offer Received',
              'On-Site Interview',
              'Phone Interview'
            ]
        },
    }],
  createdAt:    {type: Date, required: true, default: Date.now},
  updatedAt:    {type: Date, required: true, default: Date.now}
});

opportunitySchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = exports = mongoose.model('Opportunity', opportunitySchema);
