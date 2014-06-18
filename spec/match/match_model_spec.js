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
    setTimeout(checkState.bind(this, done), 100);
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

  afterEach(function () {
    delete matchMockData.valid.user;
    delete matchMockData.valid.opportunity;
  });

  it('should create a user, company, and opportunity', function () {
    expect(mockUser).toBeDefined();
    expect(mockCompany).toBeDefined();
    expect(mockOpp).toBeDefined();
  });

  it('should be able to create new match', function (done) {
    matchMockData.valid.user = mockUser._id;
    matchMockData.valid.opportunity = mockOpp._id;
    Match.create(matchMockData.valid, function (err, newMatch) {
      expect(err).toBeNull();
      expect(newMatch).toBeDefined();
      expect(newMatch.user).toEqual(matchMockData.valid.user);
      expect(newMatch.opportunity).toEqual(matchMockData.valid.opportunity);
      expect(newMatch.isProcessed).toEqual(matchMockData.valid.isProcessed);
      expect(newMatch.userInterest).toEqual(matchMockData.valid.userInterest);
      expect(newMatch.adminOverride).toEqual(matchMockData.valid.adminOverride);
      done();
    });
  });

  it('should fail when adding userInterest with score above max', function (done) {
    matchMockData.invalid.userInterestMax.user = mockUser._id;
    matchMockData.invalid.userInterestMax.opportunity = mockOpp._id;
    Match.create(matchMockData.invalid.userInterestMax, function (err, newMatch) {
      expect(err).toBeDefined();
      expect(err.errors.userInterest.type).toEqual('max');
      expect(newMatch).toBeUndefined();
      delete matchMockData.invalid.userInterestMax.opportunity;
      delete matchMockData.invalid.userInterestMax.user;
      done();
    });
  });


  it('should fail when adding userInterest with score below min', function (done) {
    matchMockData.invalid.userInterestMin.user = mockUser._id;
    matchMockData.invalid.userInterestMin.opportunity = mockOpp._id;
    Match.create(matchMockData.invalid.userInterestMin, function (err, newMatch) {
      expect(err).toBeDefined();
      expect(err.errors.userInterest.type).toEqual('min');
      expect(newMatch).toBeUndefined();
      delete matchMockData.invalid.userInterestMin.opportunity;
      delete matchMockData.invalid.userInterestMin.user;
      done();
    });
  });

  it('should fail when adding adminOverride with score above max', function (done) {
    matchMockData.invalid.adminOverrideMax.user = mockUser._id;
    matchMockData.invalid.adminOverrideMax.opportunity = mockOpp._id;
    Match.create(matchMockData.invalid.adminOverrideMax, function (err, newMatch) {
      expect(err).toBeDefined();
      expect(err.errors.adminOverride.type).toEqual('max');
      expect(newMatch).toBeUndefined();
      delete matchMockData.invalid.adminOverrideMax.opportunity;
      delete matchMockData.invalid.adminOverrideMax.user;
      done();
    });
  });


  it('should fail when adding adminOverride with score below min', function (done) {
    matchMockData.invalid.adminOverrideMin.user = mockUser._id;
    matchMockData.invalid.adminOverrideMin.opportunity = mockOpp._id;
    Match.create(matchMockData.invalid.adminOverrideMin, function (err, newMatch) {
      expect(err).toBeDefined();
      expect(err.errors.adminOverride.type).toEqual('min');
      expect(newMatch).toBeUndefined();
      delete matchMockData.invalid.adminOverrideMin.opportunity;
      delete matchMockData.invalid.adminOverrideMin.user;
      done();
    });
  });
  it('should fail to create when user and opportunity is not unique', function (done) {
    matchMockData.valid.user = mockUser._id;
    matchMockData.valid.opportunity = mockOpp._id;
    Match.create(matchMockData.valid, function (err, firsMatch) {
      expect(err).toBeNull();
      expect(firsMatch).toBeDefined();
      Match.create(matchMockData.valid, function (err, newMatch) {
        expect(err).toBeDefined();
        expect(err.code).toEqual(11000); // duplicate key error code is 11000
        expect(newMatch).toBeUndefined();
        done();
      });
    });
  });

  it('should fail to create when missing user', function (done) {
    matchMockData.valid.opportunity = mockOpp._id;
    Match.create(matchMockData.valid, function (err, newMatch) {
      expect(err).toBeDefined();
      expect(err.errors.user.type).toEqual('required');
      expect(newMatch).toBeUndefined();
      done();
    });
  });

  it('should fail to create when missing opportunity', function (done) {
    matchMockData.valid.user = mockUser._id;
    Match.create(matchMockData.valid, function (err, newMatch) {
      expect(err).toBeDefined();
      expect(err.errors.opportunity.type).toEqual('required');
      expect(newMatch).toBeUndefined();
      done();
    });
  });

  it('should have new updatedAt property on update', function (done) {
    matchMockData.valid.user = mockUser._id;
    matchMockData.valid.opportunity = mockOpp._id;
    Match.create(matchMockData.valid, function (err, newMatch) {
      expect(err).toBeNull();
      expect(newMatch).toBeDefined();
      newMatch.userInterest = 3;
      var originalTime = newMatch.updatedAt;
      newMatch.save(function (err, savedMatch) {
        expect(err).toBeNull();
        expect(savedMatch).toBeDefined();
        expect(savedMatch.userInterest).toEqual(3);
        expect(savedMatch.updatedAt.getTime()).toBeGreaterThan(originalTime);
        done();
      });
    });
  });

});

