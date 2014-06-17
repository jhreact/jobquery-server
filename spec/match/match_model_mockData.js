module.exports = exports = data = {};

data.valid = {
  userId:         null,
  oppId:          null,
  isProcessed:    true,
  userInterest:   1,
  adminOverride:  4
};

data.valid2 = {
  userId:         null,
  oppId:          null,
  isProcessed:    true,
  userInterest:   3,
  adminOverride:  1
};

data.valid3 = {
  userId:         null,
  oppId:          null,
  isProcessed:    false,
  userInterest:   4
};

data.valid4 = {
  userId:         null,
  oppId:          null,
  isProcessed:    false,
  userInterest:   2
};

data.invalid = {};

data.invalid.userInterestMax = {
  userId:         null,
  oppId:          null,
  userInterest:   5
};

data.invalid.userInterestMin = {
  userId:         null,
  oppId:          null,
  userInterest:   -1
};

data.invalid.adminOverrideMax = {
  userId:         null,
  oppId:          null,
  adminOverride:  5
};

data.invalid.adminOverrideMin = {
  userId:         null,
  oppId:          null,
  adminOverride:  -1
};

