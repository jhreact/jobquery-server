module.exports = exports = data = {};

data.valid = {
  name:             'CSS',
  label:            'Rate your CSS ability',
  scaleDescription: ['None', 'Basic', 'Experienced', 'Expert']
};

data.valid2 = {
  name:             'UX',
  label:            'Rate your UX ability',
  scaleDescription: ['None', 'Basic', 'Experienced', 'Expert']
};

data.valid3 = {
  name:             'AngularJS',
  label:            'Rate your AngularJS ability',
  scaleDescription: ['None', 'Basic', 'Experienced', 'Expert']
};

data.valid4 = {
  name:             'Node.js/Express',
  label:            'Rate your Node.js/Express ability',
  scaleDescription: ['None', 'Basic', 'Experienced', 'Expert']
};

data.valid5 = {
  name:             'Backbone',
  label:            'Rate your Backbone ability',
  scaleDescription: ['None', 'Basic', 'Experienced', 'Expert']
};

data.valid6 = {
  name:             'HTML',
  label:            'Rate your HTML ability',
  scaleDescription: ['None', 'Basic', 'Experienced', 'Expert']
};

data.missing = {};

data.missing.name = {
  label:            'Rate your CSS ability',
  scaleDescription: ['None', 'Basic', 'Experienced', 'Expert']
};

data.missing.label = {
  name:             'CSS',
  scaleDescription: ['None', 'Basic', 'Experienced', 'Expert']
};

data.invalid = {};

data.invalid.name = {
  name:             Number(123),
  label:            'Rate your CSS ability',
  scaleDescription: ['None', 'Basic', 'Experienced', 'Expert']
};

data.invalid.isPublic = {
  name:             'CSS',
  label:            'Rate your CSS ability',
  scaleDescription: ['None', 'Basic', 'Experienced', 'Expert'],
  isPublic:         'notvalid'
};

data.mixedScale = {
  name:             'CSS',
  label:            'Rate your CSS ability',
  scaleDescription: [123, true, 'undefined', null, 'extra long'],
  isPublic:         'notvalid'
};
