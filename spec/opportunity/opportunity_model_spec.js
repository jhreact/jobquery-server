var mongoose = require('mongoose');
var conn = mongoose.connection;

conn.on('error', function (err) {
  console.log('connection error:', err);
});

var Opp = require('../../server/opportunity/opportunity_model.js');
var Tag = require('../../server/tag/tag_model.js');
var User = require('../../server/user/user_model.js');
var Company = require('../../server/company/company_model.js');
var oppMockData = require('./opportunity_model_mockData.js');
var tagMockData = require('../tag/tag_model_mockData.js');
var userMockData = require('../user/user_model_mockData.js');
var companyMockData = require('../company/company_model_mockData.js');

var mockCompany;

var removeCollections = function (done) {
  var numCollections = Object.keys(conn.collections).length;
  var collectionsRemoved = 0;
  for (var i in conn.collections) {
    (function (i) {
      conn.collections[i].remove(function (err, results){
        collectionsRemoved += 1;
        if (numCollections === collectionsRemoved) {
          createCompany(done);
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

var createCompany = function (done) {
  Company.create(companyMockData.minimum, function (err, newCompany) {
    mockCompany = newCompany;
    done();
  });
};

describe('Opp Model', function () {

  beforeEach(function (done) {
    checkState(done);
  });

  it('should create a mockCompany', function () {
    expect(mockCompany).toBeDefined();
  });

  it('should only ever have one mockCompany', function () {
    Company.find(function (err, data) {
      expect(data.length).toEqual(1);
    });
  });

  it('should be able to create new document', function (done) {
    User.create([userMockData.minimum2, userMockData.valid], function (err, user1, user2) {
      expect(err).toBeNull();
      expect(user1).toBeDefined();
      expect(user2).toBeDefined();

      Tag.create([tagMockData.valid, tagMockData.valid2], function (err, tag1, tag2) {
        expect(err).toBeNull();
        expect(tag1).toBeDefined();
        expect(tag2).toBeDefined();

        oppMockData.valid.survey[0].userId = user1._id;
        oppMockData.valid.survey[1].userId = user2._id;
        oppMockData.valid.tags = [
          {tag: tag1._id, score: 1},
          {tag: tag2._id, score: 4}
        ];
        oppMockData.valid.company = mockCompany._id;

        Opp.create(oppMockData.valid, function (err, newOpp) {
          expect(err).toBeNull();
          expect(newOpp).toBeDefined();
          expect(newOpp.jobTitle).toEqual(oppMockData.valid.jobTitle);
          expect(newOpp.description).toEqual(oppMockData.valid.description);
          delete oppMockData.valid.company;
          delete oppMockData.valid.tags;
          delete oppMockData.valid.survey;
          done();
        });
      });
    });
  });

  it('should be able to create with minimum fields and use defaults', function (done) {
    oppMockData.minimum.company = mockCompany._id;
    Opp.create(oppMockData.minimum, function (err, newOpp) {
      expect(err).toBeNull();
      expect(newOpp).toBeDefined();
      expect(newOpp.active).toEqual(true);
      delete oppMockData.minimum.company;
      done();
    });
  });

  it('should fail when adding a tag with score above max', function (done) {
    Tag.create(tagMockData.valid, function (err, newTag) {
      oppMockData.minimum.tags = [{tag: newTag._id, score: 5}];
      oppMockData.minimum.company = mockCompany._id;
      Opp.create(oppMockData.minimum, function (err, newOpp) {
        expect(err).toBeDefined();
        expect(err.errors['tags.0.score'].type).toEqual('max');
        expect(newOpp).toBeUndefined();
        delete oppMockData.minimum.company;
        delete oppMockData.minimum.tags;
        done();
      });
    });
  });

  it('should fail when adding a tag with score below min', function (done) {
    Tag.create(tagMockData.valid, function (err, newTag) {
      oppMockData.minimum.tags = [{tag: newTag._id, score: -1}];
      oppMockData.minimum.company = mockCompany._id;
      Opp.create(oppMockData.minimum, function (err, newOpp) {
        expect(err).toBeDefined();
        expect(err.errors['tags.0.score'].type).toEqual('min');
        expect(newOpp).toBeUndefined();
        delete oppMockData.minimum.company;
        delete oppMockData.minimum.tags;
        done();
      });
    });
  });

  xit('should fail when tag is not valid tag reference', function (done) {
    Tag.create(tagMockData.valid, function (err, newTag) {
      var withTag = oppMockData.minimum;
      withTag.tags = [{tag: mongoose.Schema.Types.ObjectId(123), score: 1}];
      Opp.create(oppMockData.minimum, function (err, newOpp) {
        expect(err).toBeDefined();
        expect(err.name).toEqual('ValidationError');
        expect(newOpp).toBeUndefined();
        delete oppMockData.minimum.tags;
        done();
      });
    });
  });

  it('should fail to create when userId for survey is invalid', function (done) {
    oppMockData.invalid.surveyUserId.survey[0].userId =
      mongoose.Schema.Types.ObjectId(123);
    oppMockData.invalid.surveyUserId.company = mockCompany._id;
    Opp.create(oppMockData.invalid.surveyUserId, function (err, newOpp) {
      expect(err).toBeDefined();
      expect(err.errors['survey.0.userId'].type).toEqual('required');
      expect(newOpp).toBeUndefined();
      delete oppMockData.invalid.surveyUserId.survey[0].userId;
      delete oppMockData.minimum.company;
      done();
    });
  });

  it('should fail to create if survey stage is not in enumerated list', function (done) {
    User.create(userMockData.minimum, function (err, newUser) {
      expect(err).toBeNull();
      expect(newUser).toBeDefined();

      oppMockData.invalid.surveyStage.survey[0].userId = newUser._id;
      oppMockData.invalid.surveyStage.company = mockCompany._id;
      Opp.create(oppMockData.invalid.surveyStage, function (err, newOpp) {
        expect(err).toBeDefined();
        expect(err.errors['survey.0.stage'].type).toEqual('enum');
        expect(newOpp).toBeUndefined();
        delete oppMockData.invalid.surveyStage.survey[0].userId;
        delete oppMockData.minimum.company;
        done();
      });
    });
  });

  it('should have new updatedAt property on update', function (done) {
    oppMockData.minimum.company = mockCompany._id;
    Opp.create(oppMockData.minimum, function (err, newOpp) {
      expect(err).toBeNull();
      expect(newOpp).toBeDefined();
      newOpp.jobTitle = 'CTO';
      var originalTime = newOpp.updatedAt;
      newOpp.save(function (err, savedOpp) {
        expect(err).toBeNull();
        expect(savedOpp).toBeDefined();
        expect(savedOpp.jobTitle).toEqual('CTO');
        expect(savedOpp.updatedAt.getTime()).toBeGreaterThan(originalTime);
        delete oppMockData.minimum.company;
        done();
      });
    });
  });

});

