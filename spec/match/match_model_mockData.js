module.exports = exports = data = {};

data.valid = {
  userId:         null,
  oppId:          null,
  isProcessed:    false,
  userInterest:   4,
  answers:
    [
      {
        date: new Date(),
        answer: '1%'
      },
      {
        date: new Date(),
        answer: 'Only if it remains in the south bay'
      }
    ]
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
