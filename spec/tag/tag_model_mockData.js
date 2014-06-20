module.exports = exports = data = {};

data.valid = {
  name:             'CSS',
  label:            'Rate your CSS ability',
  type:             'scale'
};

data.valid2 = {
  name:             'UX',
  label:            'Rate your UX ability',
  type:             'scale'
};

data.valid3 = {
  name:             'AngularJS',
  label:            'Rate your AngularJS ability',
  type:             'scale'
};

data.valid4 = {
  name:             'Node.js/Express',
  label:            'Rate your Node.js/Express ability',
  type:             'scale'
};

data.valid5 = {
  name:             'Backbone',
  label:            'Rate your Backbone ability',
  type:             'scale'
};

data.valid6 = {
  name:             'HTML',
  label:            'Rate your HTML ability',
  type:             'scale'
};

data.missing = {};

data.missing.name = {
  label:            'Rate your CSS ability',
  type:             'scale'
};

data.missing.label = {
  name:             'CSS',
  type:             'scale'
};

data.invalid = {};

data.invalid.name = {
  name:             Number(123),
  label:            'Rate your CSS ability',
  type:             'scale'
};

data.invalid.isPublic = {
  name:             'CSS',
  label:            'Rate your CSS ability',
  type:             'scale',
  isPublic:         'notvalid'
};

data.mixedScale = {
  name:             'CSS',
  label:            'Rate your CSS ability',
  scaleDescription: [123, true, 'undefined', null, 'extra long'],
  isPublic:         'notvalid'
};
