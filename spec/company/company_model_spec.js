var mongoose = require('mongoose');
var conn = mongoose.connection;

conn.on('error', function (err) {
  console.log('connection error:', err);
});

var Company = require('../../server/company/company_model.js');
var Opp = require('../../server/opportunity/opportunity_model.js');
var companyMockData = require('./company_model_mockData.js');
var oppMockData = require('../opportunity/opportunity_model_mockData.js');

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

describe('Company Model', function () {

  beforeEach(function (done) {
    checkState(done);
  });

  it('should be able to create new document', function (done) {
    Company.create(companyMockData.valid, function (err, newCompany) {
      expect(err).toBeNull();
      expect(newCompany).toBeDefined();
      expect(newCompany.name).toEqual(companyMockData.valid.name);
      expect(newCompany.briefDescription).toEqual(companyMockData.valid.briefDescription);
      expect(newCompany.longDescription).toEqual(companyMockData.valid.longDescription);
      expect(newCompany.address).toEqual(companyMockData.valid.address);
      expect(newCompany.city).toEqual(companyMockData.valid.city);
      expect(newCompany.state).toEqual(companyMockData.valid.state);
      expect(newCompany.country).toEqual(companyMockData.valid.country);
      done();
    });
  });

  it('should fail to create when name is not unique', function (done) {
    Company.create(companyMockData.valid, function (err, firstCompany) {
      Company.create(companyMockData.valid, function (err, newCompany) {
        expect(err).toBeDefined();
        expect(err.code).toEqual(11000); // duplicate key error code is 11000
        expect(newCompany).toBeUndefined();
        done();
      });
    });
  });

  it('should fail to create when missing name', function (done) {
    Company.create(companyMockData.missing.name, function (err, newCompany) {
      expect(err).toBeDefined();
      expect(err.errors.name.type).toEqual('required');
      expect(newCompany).toBeUndefined();
      done();
    });
  });

  it('should fail when adding media object does not use caption key', function (done) {
    Company.create(companyMockData.invalid.mediaCaption, function (err, newCompany) {
      expect(err).toBeDefined();
      expect(err.errors['media.0.caption'].type).toEqual('required');
      expect(newCompany).toBeUndefined();
      done();
    });
  });

  it('should fail when adding media object does not use url key', function (done) {
    Company.create(companyMockData.invalid.mediaUrl, function (err, newCompany) {
      expect(err).toBeDefined();
      expect(err.errors['media.1.url'].type).toEqual('required');
      expect(newCompany).toBeUndefined();
      done();
    });
  });

  it('should fail when adding links object does not use title key', function (done) {
    Company.create(companyMockData.invalid.linksTitle, function (err, newCompany) {
      expect(err).toBeDefined();
      expect(err.errors['links.0.title'].type).toEqual('required');
      expect(newCompany).toBeUndefined();
      done();
    });
  });

  it('should fail when adding links object does not use url key', function (done) {
    Company.create(companyMockData.invalid.linksUrl, function (err, newCompany) {
      expect(err).toBeDefined();
      expect(err.errors['links.1.url'].type).toEqual('required');
      expect(newCompany).toBeUndefined();
      done();
    });
  });

  it('should allow valid oppIds to be pushed onto opportunities property', function (done) {
    Company.create(companyMockData.valid, function (err, newCompany) {
      expect(err).toBeNull();
      expect(newCompany).toBeDefined();

      oppMockData.minimum.company = newCompany._id;
      Opp.create(oppMockData.minimum, function (err , newOpp) {
        expect(err).toBeNull();
        expect(newOpp).toBeDefined();

        newCompany.opportunities.push(newOpp._id);
        newCompany.save(function (err, savedCompany) {
          expect(err).toBeNull();
          expect(savedCompany).toBeDefined();
          expect(savedCompany.opportunities[0]).toEqual(newOpp._id);
          expect(savedCompany.opportunities.length).toEqual(1);
          delete oppMockData.minimum.company;
          done();
        });
      });
    });
  });

  it('should have new updatedAt property on update', function (done) {
    Company.create(companyMockData.valid, function (err, newCompany) {
      expect(err).toBeNull();
      expect(newCompany).toBeDefined();
      newCompany.name = 'someName';
      var originalTime = newCompany.updatedAt;
      newCompany.save(function (err, savedCompany) {
        expect(err).toBeNull();
        expect(savedCompany).toBeDefined();
        expect(savedCompany.name).toEqual('someName');
        expect(savedCompany.updatedAt.getTime()).toBeGreaterThan(originalTime);
        done();
      });
    });
  });

});

