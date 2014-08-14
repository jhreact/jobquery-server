"use strict";

var mongoose = require('mongoose');

var mongoOID = mongoose.Schema.Types.ObjectId;

var matchSchema = new mongoose.Schema({
  user:         {type: mongoOID, required: true, ref: 'User'},
  opportunity:          {type: mongoOID, required: true, ref: 'Opportunity'},
  isProcessed:    {type: Boolean, required: true, default: false},
  // 0 means no data. 1-4 reflects user interest
  userInterest:   {type: Number, min: 0, max: 4, default: 0},

  /*
  * Admins will have the opportunity to do some special things with the values that 
  * the user has submitted (1, 2, 3, or 4), namely, they will be able to upvote or 
  * down vote them. An upvoted 2 is higher than a regular 2 and is lower than a 
  * down voted 3. Aside from up and down voted values, the admins can also 'Star', 
  * which is a hard-coded yes, or 'X' which is a hard coded no. Because there is a 
  * Star, and and X and 3 possible values for each number 1 through 4, and also the 
  * possibility of 0, there are 15 possible values. Thus adminOverride is 0 through 14.
  * At appropriate times these numbers have to be translated to their human-readable 
  * values, i.e. Admins want to see 'upvoted 3', not '10'.
  */

  adminOverride:  {type: Number, min: 0, max: 4, default: 0},
  internalNotes:  {type: String, default: null},
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
matchSchema.index({user: 1, opportunity: 1}, {unique: true});

module.exports = exports = mongoose.model('Match', matchSchema);
