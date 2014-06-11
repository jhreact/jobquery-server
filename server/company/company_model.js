"use strict";

var mongoose = require('mongoose');

var companySchema = new mongoose.Schema({
  name:           {type: String, required: true, unique: true, index: true},
  brief:          {type: String, required: true},
  description:    {type: String, required: true},
  address:        {type: String, required: true},
  city:           {type: String, required: true},
  state:          {type: String, required: true},
  country:        {type: String, default: 'US'},
  // coordinate-axis is [longitude, latitude], else store as GeoJSON object
  geo:            {type: [Number, Number], index: '2dsphere'},
  media:
    [{
      title:  {type: String, required: true},
      url:    {type: String, required: true}
    }],
  links:
    [{
      title:  {type: String, required: true},
      url:    {type: String, required: true}
    }],
  opportunities:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity'}],
  createdAt:      {type: Date, default: Date.now},
  updatedAt:      {type: Date, default: Date.now}
});

module.exports = exports = mongoose.model('Company', companySchema);
