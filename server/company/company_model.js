'use strict';

var mongoose = require('mongoose');

var mongoOID = mongoose.Schema.Types.ObjectId;

var companySchema = new mongoose.Schema({
  name:             {type: String, required: true, unique: true, index: true},
  briefDescription: {type: String},
  longDescription:  {type: String},
  address:          {type: String},
  city:             {type: String},
  state:            {type: String},
  country:          {type: String, default: 'US'},
  // coordinate-axis is [longitude, latitude], else store as GeoJSON object
  geo:              {type: [Number, Number], index: '2dsphere'},
  media:
    [{
      caption:      {type: String, required: true},
      url:          {type: String, required: true, unique: true}
    }],
  links:
    [{
      title:        {type: String, required: true},
      url:          {type: String, required: true, unique: true}
    }],
  opportunities:    [{type: mongoOID, ref: 'Opportunity'}],
  createdAt:        {type: Date, required: true, default: Date.now},
  updatedAt:        {type: Date, required: true, default: Date.now}
});

companySchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = exports = mongoose.model('Company', companySchema);
