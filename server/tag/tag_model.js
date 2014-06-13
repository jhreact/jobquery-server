'use strict';

var mongoose = require('mongoose');

var tagSchema = mongoose.Schema({
  name:             {type: String, required: true, unique: true, index: true},
  label:            {type: String, required: true},
  scaleDescription: {type: [String, String, String, String]},
  isPublic:         {type: Boolean, required: true, default: true},
  createdAt:        {type: Date, required: true, default: Date.now},
  updatedAt:        {type: Date, required: true, default: Date.now}
});

module.exports = exports = mongoose.model('Tag', tagSchema);
