"use strict";

var mongoose = require('mongoose');

var mongoOID = mongoose.Schema.Types.ObjectId;

var matchSchema = new mongoose.Schema({
  userId:         {type: mongoOID, required: true, ref: 'User'},
  oppId:          {type: mongoOID, required: true, ref: 'Opportunity'},
  isProcessed:    {type: Boolean, required: true, default: false},
  userInterest:   {type: Number, min: 0, max: 4},
  answers:
    [{
      date:       {type: Date, required: true, default: Date.now},
      answer:     {type: String, required: true}
    }],
  createdAt:      {type: Date, required: true, default: Date.now},
  updatedAt:      {type: Date, required: true, default: Date.now}
});

matchSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// compound index
matchSchema.index({userId: 1, oppId: 1}, {unique: true});

module.exports = exports = mongoose.model('Match', matchSchema);
