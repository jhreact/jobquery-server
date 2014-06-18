var request = require('supertest');
var express = require('express');
var app = require('../../server/main/app.js');

var oppCtrl = require('../../server/opportunity/opportunity_controllers.js');
var mongoose = require('mongoose');
var conn = mongoose.connection;

conn.on('error', function (err) {
  console.log('connection error:', err);
});

var Opp = require('../../server/opportunity/opportunity_model.js');
var Company = require('../../server/company/company_model.js');
var Tag = require('../../server/tag/tag_model.js');
var User = require('../../server/user/user_model.js');
var oppMockData = require('./opportunity_model_MockData.js');
var companyMockData = require('../company/company_model_MockData.js');
var tagMockData = require('../tag/tag_model_MockData.js');
var userMockData = require('../user/user_model_MockData.js');

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


describe('Opportunity Controller', function () {

  it('should have a get method', function () {
    expect(oppCtrl.get).toEqual(jasmine.any(Function));
  });

  it('should have a post method', function () {
    expect(oppCtrl.post).toEqual(jasmine.any(Function));
  });

  it('should have a getById method', function () {
    expect(oppCtrl.getById).toEqual(jasmine.any(Function));
  });

  it('should have a putById method', function () {
    expect(oppCtrl.putById).toEqual(jasmine.any(Function));
  });

});

describe('Opportunity Controller', function () {

  beforeEach(function (done) {
    checkState(done);
  });

  it('should be able to POST', function (done) {
    // create tag
    var tag;
    request(app)
    .post('/api/tags')
    .send(tagMockData.valid2)
    .end(function (err, newTag) {
      if (err) return done(err);
      tag = newTag.body;
      expect(newTag.statusCode).toEqual(201);

      // create user
      var user;
      request(app)
      .post('/api/users')
      .send(userMockData.minimum)
      .end(function (err, newUser) {
        if (err) return done(err);
        user = newUser.body;
        expect(newUser.statusCode).toEqual(201);

        // create opportunity
        oppMockData.minimum.company = mockCompany._id;
        oppMockData.minimum.tags = [{tag: tag, score: 1}];
        oppMockData.minimum.survey = [{
          user: user,
          salary: 75000,
          notes: ['comment 1', 'comment 2'],
          stage: 'On-Site Interview'
        }];

        request(app)
        .post('/api/opportunities')
        .send(oppMockData.minimum)
        .end(function (err, newOpp) {
          if (err) return done(err);
          expect(newOpp.statusCode).toEqual(201);
          delete oppMockData.minimum.company;
          delete oppMockData.minimum.tags;
          delete oppMockData.minimum.survey;
          done();
        });
      });
    });
  });

  it('should be able to GET and populate', function (done) {
    // create tag
    var tag;
    request(app)
    .post('/api/tags')
    .send(tagMockData.valid2)
    .end(function (err, newTag) {
      if (err) return done(err);
      tag = newTag.body;
      expect(newTag.statusCode).toEqual(201);

      // create user
      var user;
      request(app)
      .post('/api/users')
      .send(userMockData.minimum)
      .end(function (err, newUser) {
        if (err) return done(err);
        user = newUser.body;
        expect(newUser.statusCode).toEqual(201);

        // setup & create opportunity1
        oppMockData.minimum.company = mockCompany._id;
        oppMockData.minimum.tags = [{tag: tag, score: 1}];
        oppMockData.minimum.survey = [{
          user: user,
          salary: 75000,
          notes: ['comment 1', 'comment 2'],
          stage: 'On-Site Interview'
        }];
        request(app)
        .post('/api/opportunities')
        .send(oppMockData.minimum)
        .end(function (err, newOpp1) {
          if (err) return done(err);
          expect(newOpp1.statusCode).toEqual(201);
          delete oppMockData.minimum.company;
          delete oppMockData.minimum.tags;
          delete oppMockData.minimum.survey;

          // setup & create opportunity2
          oppMockData.minimum2.company = mockCompany._id;
          oppMockData.minimum2.tags = [{tag: tag, score: 4}];
          oppMockData.minimum2.survey = [{
            user: user,
            salary: 150000,
            notes: ['i would be CTO!', 'i would be the entire eng team...'],
            stage: 'Offer Received'
          }];

          request(app)
          .post('/api/opportunities')
          .send(oppMockData.minimum2)
          .end(function (err, newOpp2) {
            if (err) return done(err);
            expect(newOpp2.statusCode).toEqual(201);
            delete oppMockData.minimum2.company;
            delete oppMockData.minimum2.tags;
            delete oppMockData.minimum2.survey;

            // check both opportunities returned in GET
            request(app)
            .get('/api/opportunities')
            .end(function (err, results) {
              if (err) return done(err);
              expect(results.statusCode).toEqual(200);
              expect(results.body.length).toEqual(2);
              expect(results.body[0].company.name).toEqual(mockCompany.name);
              expect(results.body[0].tags[0].tag.label).toEqual(tagMockData.valid2.label);
              expect(results.body[0].survey[0].user.name).toEqual(userMockData.minimum.name);
              done();
            });
          });
        });
      });
    });
  });

it('should be able to GET by opportunity and populate', function (done) {
    // create tag
    var tag;
    request(app)
    .post('/api/tags')
    .send(tagMockData.valid2)
    .end(function (err, newTag) {
      if (err) return done(err);
      tag = newTag.body;
      expect(newTag.statusCode).toEqual(201);

      // create user
      var user;
      request(app)
      .post('/api/users')
      .send(userMockData.minimum)
      .end(function (err, newUser) {
        if (err) return done(err);
        user = newUser.body;
        expect(newUser.statusCode).toEqual(201);

        // setup & create opportunity2
        oppMockData.minimum2.company = mockCompany._id;
        oppMockData.minimum2.tags = [{tag: tag, score: 4}];
        oppMockData.minimum2.survey = [{
          user: user,
          salary: 150000,
          notes: ['i would be CTO!', 'i would be the entire eng team...'],
          stage: 'Offer Received'
        }];

        var opportunity;
        request(app)
        .post('/api/opportunities')
        .send(oppMockData.minimum2)
        .end(function (err, newOpp) {
          if (err) return done(err);
          opportunity = newOpp.body;
          expect(newOpp.statusCode).toEqual(201);
          delete oppMockData.minimum2.company;
          delete oppMockData.minimum2.tags;
          delete oppMockData.minimum2.survey;

          // check properties returned in GET
          request(app)
          .get('/api/opportunities/' + opportunity)
          .end(function (err, opp) {
            if (err) return done(err);
            expect(opp.statusCode).toEqual(200);
            expect(opp.body.company.name).toEqual(mockCompany.name);
            expect(opp.body.tags[0].tag.label).toEqual(tagMockData.valid2.label);
            expect(opp.body.survey[0].user.name).toEqual(userMockData.minimum.name);
            done();
          });
        });
      });
    });
  });

  it('should FAIL to GET with an invalid opportunity', function (done) {
    var opportunity = '/api/opportunities/' + '123456789';
    oppMockData.minimum.company = mockCompany._id;

    request(app)
    .post('/api/opportunities')
    .send(oppMockData.minimum)
    .end(function (err, res) {
      expect(res.statusCode).toEqual(201);

      request(app)
      .get(opportunity)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.statusCode).toEqual(500);
        delete oppMockData.minimum.company;
        done();
      });
    });
  });

  it('should update (via PUT) an existing opportunity', function (done) {
    oppMockData.minimum.company = mockCompany._id;
    var opportunity;
    request(app)
    .post('/api/opportunities')
    .send(oppMockData.minimum)
    .end(function (err, res) {
      expect(res.statusCode).toEqual(201);
      opportunity = res.body;

      // add properties
      request(app)
      .put('/api/opportunities/' + opportunity)
      .send({internalNotes: [{date: new Date(), text: 'omgwtfbbq'}]})
      .end(function (err, res2) {
        expect(res2.statusCode).toEqual(201);
        delete oppMockData.minimum.company;
        delete oppMockData.minimum.internalNotes;

        request(app)
        .get('/api/opportunities/' + opportunity)
        .end(function (err, res3) {
          expect(res3.statusCode).toEqual(200);
          expect(res3.body.internalNotes[0].text).toEqual('omgwtfbbq');
          done();
        });
      });
    });
  });

});
