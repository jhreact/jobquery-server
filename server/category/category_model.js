/* jslint node: true */
'use strict';

var mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
  name:         {type: String, required: true},
  type:
  {
    type: String,
    required: true,
    enum: ['Tag', 'User', 'Opportunity'],
    default: 'Tag'
  },
  rank:         {type: Number, default: 1},
  createdAt:    {type: Date, required: true, default: Date.now},
  updatedAt:    {type: Date, required: true, default: Date.now}
});

categorySchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// compound index
categorySchema.index({name: 1, type: 1}, {unique: true});

module.exports = exports = mongoose.model('Category', categorySchema);
