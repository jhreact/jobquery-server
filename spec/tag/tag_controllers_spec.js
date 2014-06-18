var request = require('supertest');
var express = require('express');
var app = require('../../server/main/app.js');

var tagCtrl = require('../../server/tag/tag_controllers.js');
var mongoose = require('mongoose');
var conn = mongoose.connection;

conn.on('error', function (err) {
  console.log('connection error:', err);
});

var Tag = require('../../server/tag/tag_model.js');
var Category = require('../../server/category/category_model.js');
var tagMockData = require('./tag_model_MockData.js');
var categoryMockData = require('../category/category_model_MockData.js');

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

describe("Tag Controller", function() {

    it("should have a post method", function () {
        expect(tagCtrl.post).toBeDefined();
    });

    it("should have a get method", function () {
        expect(tagCtrl.get).toBeDefined();
    });

    it("should have a getById method", function () {
        expect(tagCtrl.getById).toBeDefined();
    });

    it("should have a putById method", function () {
        expect(tagCtrl.putById).toBeDefined();
    });
});

describe('Tag Controller', function () {

  beforeEach(function (done) {
    checkState(done);
  });

  it('should be able to POST', function (done) {
    request(app)
    .post('/api/tags')
    .send(tagMockData.valid)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.statusCode).toEqual(201);
      done();
    });
  });

  it('should be able to GET', function (done) {
    // post tag1
    request(app)
    .post('/api/tags')
    .send(tagMockData.valid)
    .end(function (err, res) {
      expect(res.statusCode).toEqual(201);

      // post tag2
      request(app)
      .post('/api/tags')
      .send(tagMockData.valid2)
      .end(function (err, res) {
        expect(res.statusCode).toEqual(201);

        // retrieve both tags
        request(app)
        .get('/api/tags')
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body.length).toEqual(2);
          expect(res.statusCode).toEqual(200);
          done();
        });
      });
    });
  });

  it('should be able to GET a specific tag', function (done) {
    // post tag1
    var tag;
    request(app)
    .post('/api/tags')
    .send(tagMockData.valid)
    .end(function (err, res) {
      tag = res.body;
      expect(res.statusCode).toEqual(201);

      // post tag2
      request(app)
      .post('/api/tags')
      .send(tagMockData.valid2)
      .end(function (err, res) {
      expect(res.statusCode).toEqual(201);

        // retrieve only tag1
        request(app)
        .get('/api/tags/' + tag)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body._id).toEqual(tag);
          expect(res.statusCode).toEqual(200);
          done();
        });
      });
    });
  });

  it('should FAIL to GET with an invalid tag', function (done) {
    var tag = '/api/tags/' + '123456789';
    request(app)
    .post('/api/tags')
    .send(tagMockData.valid)
    .end(function (err, res) {
      expect(res.statusCode).toEqual(201);

      request(app)
      .get(tag)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.statusCode).toEqual(500);
        done();
      });
    });
  });

  it('should POST and GET tag', function (done) {
    // create tag
    request(app)
    .post('/api/tags')
    .send(tagMockData.valid3)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.statusCode).toEqual(201);

      // retrieve tag
      request(app)
      .get('/api/tags/' + res.body)
      .end(function (err, res) {
      if (err) return done(err);
        expect(res.statusCode).toEqual(200);
        done();
      });
    });
  });

  it('should update (via PUT) and populate tag an existing tag', function (done) {
    // create category
    var categoryId;
    request(app)
    .post('/api/categories')
    .send(categoryMockData.valid2)
    .end(function (err, newCategory) {
      categoryId = newCategory.body;

      var category1;
      request(app)
      .get('/api/categories')
      .end(function (err, cat1) {
        category1 = cat1.body[0];

        // create category2
        var categoryId2;
        request(app)
        .post('/api/categories')
        .send(categoryMockData.valid3)
        .end(function (err, newCategory2) {
          categoryId2 = newCategory2.body;

          // create tag
          var tag;
          tagMockData.valid4.category = categoryId2;
          request(app)
          .post('/api/tags')
          .send(tagMockData.valid4)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.statusCode).toEqual(201);
            tag = res.body;

            // request tag
            request(app)
            .get('/api/tags/' + tag)
            .end(function (err, reqTag) {

              // update tag
              reqTag.body.name = 'Bare Node';
              reqTag.body.category = category1;
              request(app)
              .put('/api/tags/' + tag)
              .send(reqTag.body)
              .end(function (err, res2) {
                if (err) return done(err);
                expect(res2.statusCode).toEqual(201);

                request(app)
                .get('/api/tags')
                .end(function (err, data) {
                  expect(data.body[0].category).toBeDefined();
                  expect(data.body[0].category.name).toEqual(
                    categoryMockData.valid2.name);
                  done();
                });
              });
            });
          });
        });
      });
    });
  });

});

