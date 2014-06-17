module.exports = exports = data = {};

data.valid = {
  active:             false,
  jobTitle:           'Generalist Developer',
  description:        "We're looking for someone with strong technical problem solving skills, excellent communication skills, and an eagerness to learn and take on responsibility. This engineer will be responsible for working on all aspects of the Upstart platform, from our data prediction model to our social networking platform and crowdfunding marketplace. You'll enjoy significant autonomy in designing new systems and crafting elegant user experiences.",
  links:
    [
      {
        title: 'generalist developer',
        url: 'https://www.upstart.com/jobs#career-listing-1'
      },
      {
        title: 'jobs',
        url: 'https://www.upstart.com/jobs'
      }
    ],
  notes:
    [
      {text: 'The quick brown fox jumped over the lazy dog.'},
      {text: 'There is nothing like sudden death OT in game 7.'}
    ],
  internalNotes:
    [
      {text: 'We know this recruiter well.'},
      {text: 'We have placed 2 people there previously.'}
    ],
  questions:
    [
      {question: 'How much equity do you expect?'},
      {question: 'Okay if company relocates offices in the next year?'}
    ],
  survey:
    [
      {
        salary: 100000,
        notes:  ['Great interview experience', 'Office is a bit small'],
        stage:  'Offer Received'
      },
      {
        salary: 0,
        notes:  ['Difficult questions', 'Requires full day experience'],
        stage:  'On-Site Interview'
      }
    ]
};

data.minimum = {
  jobTitle:           'Generalist Developer',
  description:        "We're looking for someone with strong technical problem solving skills, excellent communication skills, and an eagerness to learn and take on responsibility. This engineer will be responsible for working on all aspects of the Upstart platform, from our data prediction model to our social networking platform and crowdfunding marketplace. You'll enjoy significant autonomy in designing new systems and crafting elegant user experiences."
};

data.minimum2 = {
  jobTitle:           'CTO',
  description:        "ALWAYS. BE. CODING."
};

data.invalid = {};

data.invalid.linksTitle = {
    jobTitle:           'Generalist Developer',
  description:        "We're looking for someone with strong technical problem solving skills, excellent communication skills, and an eagerness to learn and take on responsibility. This engineer will be responsible for working on all aspects of the Upstart platform, from our data prediction model to our social networking platform and crowdfunding marketplace. You'll enjoy significant autonomy in designing new systems and crafting elegant user experiences.",
  links:
    [{
      randomKey: 'browse loans',
      url: 'https://www.upstart.com/assets/invest/browse_loans-ff2a8b457e3bd8118d804f5874ba29e4.png'
    }]
};

data.invalid.linksUrl = {
  jobTitle:           'Generalist Developer',
  description:        "We're looking for someone with strong technical problem solving skills, excellent communication skills, and an eagerness to learn and take on responsibility. This engineer will be responsible for working on all aspects of the Upstart platform, from our data prediction model to our social networking platform and crowdfunding marketplace. You'll enjoy significant autonomy in designing new systems and crafting elegant user experiences.",
  links:
    [{
      title: 'browse loans',
      notUrlKey: 'https://www.upstart.com/assets/invest/browse_loans-ff2a8b457e3bd8118d804f5874ba29e4.png'
    }]
};

data.invalid.surveyStage = {
  jobTitle:           'Generalist Developer',
  description:        "We're looking for someone with strong technical problem solving skills, excellent communication skills, and an eagerness to learn and take on responsibility. This engineer will be responsible for working on all aspects of the Upstart platform, from our data prediction model to our social networking platform and crowdfunding marketplace. You'll enjoy significant autonomy in designing new systems and crafting elegant user experiences.",
  survey: [{
    salary: 100000,
    notes:  ['Great interview experience', 'Office is a bit small'],
    stage:  'off the board'
  }]
};

data.invalid.surveyUserId = {
  jobTitle:           'Generalist Developer',
  description:        "We're looking for someone with strong technical problem solving skills, excellent communication skills, and an eagerness to learn and take on responsibility. This engineer will be responsible for working on all aspects of the Upstart platform, from our data prediction model to our social networking platform and crowdfunding marketplace. You'll enjoy significant autonomy in designing new systems and crafting elegant user experiences.",
  survey: [{
    salary: 100000,
    notes:  ['Great interview experience', 'Office is a bit small'],
    stage:  'Offer Received'
  }]
};

