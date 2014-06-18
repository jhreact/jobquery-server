"use strict";

var mongoose = require('mongoose');

var mongoOID = mongoose.Schema.Types.ObjectId;

var userSchema = new mongoose.Schema({
  email:          {type: String, required: true, unique: true, index: true},
  password:       {type: String, required: true, select: false},
  name:           {type: String, index: true},
  github:         {type: String},
  linkedin:       {type: String},
  isAdmin:        {type: Boolean, required: true},
  isRegistered:   {type: Boolean, required: true, default: false},
  searchStage:
    {
      type: String,
      required: true,
      enum: ['Early', 'Mid/Late', 'Closing', 'Accepted'],
      default: 'Early'
    },
  tags:
    [{
      tag: {type: mongoOID, ref: 'Tag', required: true},
      score: {type: Number, min: 0, max: 4, required: true}
    }],
  messages:
    [{
      date:     {type: Date, required: true, default: Date.now},
      question: {type: String, required: true},
      answer:   {type: String}
    }],
  city:           {type: String},
  state:          {type: String},
  country:        {type: String},
  // coordinate-axis is [longitude, latitude], else store as GeoJSON object
  geo:            {type: [Number, Number], index: '2dsphere'},
  category:       {type: mongoOID, ref: 'Category'},
  createdAt:      {type: Date, required: true, default: Date.now},
  updatedAt:      {type: Date, required: true, default: Date.now}
});

userSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = exports = mongoose.model('User', userSchema);
