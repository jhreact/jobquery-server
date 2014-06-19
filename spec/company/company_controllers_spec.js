var request = require('supertest');
var express = require('express');
var app = require('../../server/main/app.js');

var companyCtrl = require('../../server/company/company_controllers.js');
var mongoose = require('mongoose');
var conn = mongoose.connection;

conn.on('error', function (err) {
  console.log('connection error:', err);
});

var Company = require('../../server/company/company_model.js');
var companyMockData = require('./company_model_MockData.js');

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

describe('Company Controller', function () {

  it('should have a get method', function () {
    expect(companyCtrl.get).toEqual(jasmine.any(Function));
  });

  it('should have a post method', function () {
    expect(companyCtrl.post).toEqual(jasmine.any(Function));
  });

  it('should have a getById method', function () {
    expect(companyCtrl.getById).toEqual(jasmine.any(Function));
  });

  it('should have a putById method', function () {
    expect(companyCtrl.putById).toEqual(jasmine.any(Function));
  });

});

describe('Company Controller', function () {

  beforeEach(function (done) {
    checkState(done);
  });

  it('should be able to POST', function (done) {
    request(app)
    .post('/api/companies')
    .send(companyMockData.valid)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.statusCode).toEqual(201);
      done();
    });
  });

  it('should be able to GET', function (done) {
    // post company1
    request(app)
    .post('/api/companies')
    .send(companyMockData.valid)
    .end(function (err, res) {
      expect(res.statusCode).toEqual(201);

      // post company2
      request(app)
      .post('/api/companies')
      .send(companyMockData.minimum2)
      .end(function (err, res) {
        expect(res.statusCode).toEqual(201);

        // retrieve both companies
        request(app)
        .get('/api/companies')
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body.length).toEqual(2);
          expect(res.statusCode).toEqual(200);
          done();
        });
      });
    });
  });

  it('should be able to GET a specific companyId', function (done) {
    // post company1
    var companyId;
    request(app)
    .post('/api/companies')
    .send(companyMockData.valid)
    .end(function (err, res) {
      companyId = res.body._id;
      expect(res.statusCode).toEqual(201);

      // post company2
      request(app)
      .post('/api/companies')
      .send(companyMockData.minimum2)
      .end(function (err, res) {
      expect(res.statusCode).toEqual(201);

        // retrieve only company1
        request(app)
        .get('/api/companies/' + companyId)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body._id).toEqual(companyId);
          expect(res.statusCode).toEqual(200);
          done();
        });
      });
    });
  });

  it('should FAIL to GET with an invalid companyId', function (done) {
    var companyId = '/api/companies/' + '123456789';
    request(app)
    .post('/api/companies')
    .send(companyMockData.valid)
    .end(function (err, res) {
      expect(res.statusCode).toEqual(201);

      request(app)
      .get(companyId)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.statusCode).toEqual(500);
        done();
      });
    });
  });

  it('should update (via PUT) an existing company by companyId', function (done) {
    // create company
    var companyId;
    request(app)
    .post('/api/companies')
    .send(companyMockData.valid)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.statusCode).toEqual(201);
      companyId = res.body._id;

      // update company
      request(app)
      .put('/api/companies/' + companyId)
      .send({
        name: 'Microsoft',
      })
      .end(function (err, res2) {
        if (err) return done(err);
        expect(res2.statusCode).toEqual(201);
        done();
        });
      });
  });

});
