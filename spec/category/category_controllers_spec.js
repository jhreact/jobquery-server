var request = require('supertest');
var express = require('express');
var app = require('../../server/main/app.js');

var categoryCtrl = require('../../server/category/category_controllers.js');
var mongoose = require('mongoose');
var conn = mongoose.connection;

conn.on('error', function (err) {
  console.log('connection error:', err);
});

var Category = require('../../server/category/category_model.js');
var categoryMockData = require('./category_model_MockData.js');

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

describe('Category Controller', function () {

  it('should have a get method', function () {
    expect(categoryCtrl.get).toEqual(jasmine.any(Function));
  });

  it('should have a post method', function () {
    expect(categoryCtrl.post).toEqual(jasmine.any(Function));
  });

  it('should have a getByType method', function () {
    expect(categoryCtrl.getByType).toEqual(jasmine.any(Function));
  });

  it('should have a putById method', function () {
    expect(categoryCtrl.putById).toEqual(jasmine.any(Function));
  });

});

describe('Category Controller', function () {

  beforeEach(function (done) {
    checkState(done);
  });

  it('should be able to POST', function (done) {
    request(app)
    .post('/api/categories')
    .send(categoryMockData.valid)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.statusCode).toEqual(201);
      done();
    });
  });

  it('should be able to GET', function (done) {
    // post category1
    request(app)
    .post('/api/categories')
    .send(categoryMockData.valid)
    .end(function (err, res) {
      expect(res.statusCode).toEqual(201);

      // post category2
      request(app)
      .post('/api/categories')
      .send(categoryMockData.minimum2)
      .end(function (err, res) {
        expect(res.statusCode).toEqual(201);

        // retrieve both categories
        request(app)
        .get('/api/categories')
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body.length).toEqual(2);
          expect(res.statusCode).toEqual(200);
          done();
        });
      });
    });
  });

  it('should be able to GET a specific category type', function (done) {
    // post category1
    var categoryType = categoryMockData.valid.type;
    request(app)
    .post('/api/categories')
    .send(categoryMockData.valid)
    .end(function (err, res) {
      expect(res.statusCode).toEqual(201);

      // post category2
      request(app)
      .post('/api/categories')
      .send(categoryMockData.valid2)
      .end(function (err, res) {
        expect(res.statusCode).toEqual(201);

        // retrieve only category1
        request(app)
        .get('/api/categories/type/' + categoryType)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body[0].type).toEqual(categoryType);
          expect(res.statusCode).toEqual(200);
          done();
        });
      });
    });
  });

  it('should FAIL to PUT with an invalid categoryId', function (done) {
    var categoryId = '/api/categories/' + '123456789';
    request(app)
    .put(categoryId)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.statusCode).toEqual(500);

      request(app)
      .get('/api/categories/')
      .end(function (err, data) {
        if (err) return done(err);
        expect(data.body.length).toEqual(0);
        done();
      });
    });
  });

  it('should update (via PUT) an existing category by categoryId', function (done) {
    // create category
    var categoryId;
    request(app)
    .post('/api/categories')
    .send(categoryMockData.valid)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.statusCode).toEqual(201);
      categoryId = res.body;

      // update category
      request(app)
      .put('/api/categories/' + categoryId)
      .send({
        name: 'vertical jump',
        type: 'Opportunity'
      })
      .end(function (err, res2) {
        if (err) return done(err);
        expect(res2.statusCode).toEqual(201);

        // check update
        request(app)
        .get('/api/categories')
        .end(function (err, res3) {
          if (err) return done(err);
          expect(res3.statusCode).toEqual(200);
          done();
        });
      });
    });
  });

});
