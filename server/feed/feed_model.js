'use strict';

var mongoose = require('mongoose');

var mongoOID = mongoose.Schema.Types.ObjectId;

var feedSchema = new mongoose.Schema({
  user:    [{type: mongoOID, ref: 'User'}],
  action: {type: String},
  target:    mongoOID,
  targetType:    {type: String},
  description:      {type: String},
  createdAt:        {type: Date, required: true, default: Date.now},
  updatedAt:        {type: Date, required: true, default: Date.now}
});

feedSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = exports = mongoose.model('feed', feedSchema);
