"use strict";

var mongoose = require('mongoose');

var mongoOID = mongoose.Schema.Types.ObjectId;

var userSchema = new mongoose.Schema({
  email:          {type: String, required: true, unique: true, index: true},
  password:       {type: String, required: true, select: false},
  name:           {type: String, required: true, index: true},
  github:         {type: String},
  linkedin:       {type: String},
  isAdmin:        {type: Boolean, required: true},
  isRegistered:   {type: Boolean, required: true},
  searchStage:
    {
      type: String,
      required: true,
      enum: ['Early', 'Mid/Late', 'Closing', 'Accepted'],
      default: 'Early'
    },
  tags:
    [{
      tagId: {type: mongoOID, ref: 'Tag', required: true},
      score: {type: Number, min: 0, max: 4, required: true}
    }],
  city:           {type: String},
  state:          {type: String},
  country:        {type: String},
  // coordinate-axis is [longitude, latitude], else store as GeoJSON object
  geo:            {type: [Number, Number], index: '2dsphere'},
  createdAt:      {type: Date, required: true, default: Date.now},
  updatedAt:      {type: Date, required: true, default: Date.now}
});

userSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = exports = mongoose.model('User', userSchema);
