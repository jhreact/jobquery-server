var mongoose = require('mongoose');
var conn = mongoose.connection;

conn.on('error', function (err) {
  console.log('connection error:', err);
});

var Match = require('../../server/match/match_model.js');
var User = require('../../server/user/user_model.js');
var Company = require('../../server/company/company_model.js');
var Opp = require('../../server/opportunity/opportunity_model.js');
var matchMockData = require('./match_model_mockData.js');
var userMockData = require('../user/user_model_mockData.js');
var companyMockData = require('../company/company_model_mockData.js');
var oppMockData = require('../opportunity/opportunity_model_mockData.js');

var mockUser;
var mockCompany;
var mockOpp;
var generatedMatch;

var removeCollections = function (done) {
  var numCollections = Object.keys(conn.collections).length;
  var collectionsRemoved = 0;
  for (var i in conn.collections) {
    (function (i) {
      conn.collections[i].remove(function (err, results){
        collectionsRemoved += 1;
        if (numCollections === collectionsRemoved) {
          done();
        }
      });
    })(i);
  }
};

var reconnect = function (done) {
  mongoose.connect('mongodb://localhost/myApp', function (err) {
    if (err) {
      console.log('reconnect error');
      throw err;
    }
    return removeCollections(done);
  });
};

var checkState = function (done) {
  switch (conn.readyState) {
  case 0:
    reconnect(done);
    break;
  case 1:
    removeCollections(done);
    break;
  default:
    setTimeout(checkState.bind(this, done), 200);
  }
};

var createUser = function (done) {
  User.create(userMockData.minimum, function (err, newUser) {
    mockUser = newUser;
    done();
  });
};

var createCompany = function (done) {
  Company.create(companyMockData.minimum, function (err, newCompany) {
    mockCompany = newCompany;
    done();
  });
};

var createOpportunity = function (done) {
  oppMockData.minimum.company = mockCompany._id;
  Opp.create(oppMockData.minimum, function (err, newOpp) {
    mockOpp = newOpp;
    setTimeout(done, 200);
  });
};

var findMatchId = function (done) {
  Match.findOne(function (err, match) {
    generatedMatch = match;
    done();
  });
};

describe('Opp Model', function () {

  beforeEach(function (done) {
    checkState(done);
  });

  beforeEach(function (done) {
    createUser(done);
  });

  beforeEach(function (done) {
    createCompany(done);
  });

  beforeEach(function (done) {
    createOpportunity(done);
  });

  beforeEach(function (done) {
    findMatchId(done);
  });

  it('should create a user, company, and opportunity...which automatically creates a match', function () {
    expect(mockUser).toBeDefined();
    expect(mockCompany).toBeDefined();
    expect(mockOpp).toBeDefined();

    expect(generatedMatch).toBeDefined();
    expect(generatedMatch.user).toEqual(mockUser._id);
    expect(generatedMatch.opportunity).toEqual(mockOpp._id);
  });

  it('should fail when setting userInterest with score above max', function (done) {
    generatedMatch.userInterest = 5;
    generatedMatch.save(function (err, savedMatch) {
      expect(err).toBeDefined();
      expect(err.errors.userInterest.type).toEqual('max');
      expect(savedMatch).toBeUndefined();
      generatedMatch.userInterest = 0; // reset
      done();
    });
  });

  it('should fail when setting userInterest with score below min', function (done) {
    generatedMatch.userInterest = -1;
    generatedMatch.save(function (err, savedMatch) {
      expect(err).toBeDefined();
      expect(err.errors.userInterest.type).toEqual('min');
      expect(savedMatch).toBeUndefined();
      generatedMatch.userInterest = 0; // reset
      done();
    });
  });

  it('should fail when setting adminOverride with score above max', function (done) {
    generatedMatch.adminOverride = 5;
    generatedMatch.save(function (err, savedMatch) {
      expect(err).toBeDefined();
      expect(err.errors.adminOverride.type).toEqual('max');
      expect(savedMatch).toBeUndefined();
      generatedMatch.adminOverride = 0; // reset
      done();
    });
  });

  it('should fail when setting adminOverride with score below min', function (done) {
    generatedMatch.adminOverride = -1;
    generatedMatch.save(function (err, savedMatch) {
      expect(err).toBeDefined();
      expect(err.errors.adminOverride.type).toEqual('min');
      expect(savedMatch).toBeUndefined();
      generatedMatch.adminOverride = 0; // reset
      done();
    });
  });

  it('should have new updatedAt property on update', function (done) {
    generatedMatch.userInterest = 3;
    var originalTime = generatedMatch.updatedAt;
    generatedMatch.save(function (err, savedMatch) {
      expect(err).toBeNull();
      expect(savedMatch).toBeDefined();
      expect(savedMatch.userInterest).toEqual(3);
      expect(savedMatch.updatedAt.getTime()).toBeGreaterThan(originalTime);
      generatedMatch.userInterest = 0; // reset
      done();
    });
  });

});

