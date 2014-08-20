'use strict';

var mongoose = require('mongoose');

var mongoOID = mongoose.Schema.Types.ObjectId;

// Example:
// <User123.id> (user) added (action) <opportunity1.id> (actionObject) to <company1.id> (target)
var feedSchema = new mongoose.Schema({
  user:    [{type: mongoOID, ref: 'User'}],
  action: {type: String},
  actionObject: mongoOID,
  actionObjectType: {type: String},
  target:    mongoOID,
  targetType:    {type: String},
  createdAt:        {type: Date, required: true, default: Date.now},
  updatedAt:        {type: Date, required: true, default: Date.now}
});

feedSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = exports = mongoose.model('Feed', feedSchema);
