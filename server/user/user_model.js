"use strict";

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  email:          {type: String, required: true, unique: true},
  // TODO: provide users with auto-generated passwords upon invitation
  password:       {type: String, required: true, select: false},
  name:           {type: String, required: true, index: true},
  admin:          {type: Boolean, required: true},
  registered:     {type: Boolean, required: true},
  tags:           {type:
    [{
      tagId: {type: mongoose.Schema.Types.ObjectId, ref: 'Tag'},
      score: {type: Number, min: 1, max: 4}
    }],
    required: true},
  opportunities:  {type:
    [{
      oppId:      {type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity'},
      score:      {type: Number, min: 1, max: 4},
      questions:  {type: [String]}
    }],
    required: true},
  city:           {type: String},
  state:          {type: String},
  country:        {type: String, default: 'US'},
  // coordinate-axis is [longitude, latitude], else store as GeoJSON object
  geo:            {type: [Number, Number], index: '2dsphere'},
  createdAt:      {type: Date, default: Date.now},
  updatedAt:      {type: Date, default: Date.now}
});

module.exports = exports = mongoose.model('User', userSchema);
