module.exports = exports = data = {};

data.valid = {
  email:          'ksmith@gmail.com',
  password:       'verysecure password',
  name:           'Kevin Smith',
  github:         'github.com/ksmith',
  linkedin:       'linkedin.com/in/ksmith',
  isAdmin:        false,
  isRegistered:   false,
  searchStage:    'Early',
  city:           'San Francisco',
  state:          'CA',
  country:        'USA'
};

data.minimum = {
  email:          'ksmith@gmail.com',
  password:       'verysecure password',
  name:           'Kevin Smith',
  isAdmin:        false,
  isRegistered:   false,
  searchStage:    'Early'
};

data.minimum2 = {
  email:          'janedoe@gmail.com',
  password:       'verysecure password',
  name:           'Jane Doe',
  isAdmin:        false,
  isRegistered:   false,
  searchStage:    'Early'
};

data.missing = {};

data.missing.email = {
  name:          'Kevin Smith',
  password:       'verysecure password',
  isAdmin:        false,
  isRegistered:   false,
  searchStage:    'Early'
};

data.missing.password = {
  email:          'ksmith@gmail.com',
  name:           'Kevin Smith',
  isAdmin:        false,
  isRegistered:   false,
  searchStage:    'Early'
};

data.missing.name = {
  email:          'ksmith@gmail.com',
  password:       'verysecure password',
  isAdmin:        false,
  isRegistered:   false,
  searchStage:    'Early'
};

data.missing.isAdmin = {
  email:          'ksmith@gmail.com',
  password:       'verysecure password',
  name:           'Kevin Smith',
  isRegistered:   false,
  searchStage:    'Early'
};

data.missing.searchStage = {
  email:          'ksmith@gmail.com',
  password:       'verysecure password',
  name:           'Kevin Smith',
  isAdmin:        false,
  isRegistered:   false
};

data.invalid = {};

data.invalid.searchStage = {
  email:          'ksmith@gmail.com',
  password:       'verysecure password',
  name:           'Kevin Smith',
  isAdmin:        false,
  isRegistered:   false,
  searchStage:    'notInEnumeratedList'
};
