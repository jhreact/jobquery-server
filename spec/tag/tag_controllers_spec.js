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
var tagMockData = require('./tag_model_MockData.js');

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

  it('should be able to GET a specific tagId', function (done) {
    // post tag1
    var tagId;
    request(app)
    .post('/api/tags')
    .send(tagMockData.valid)
    .end(function (err, res) {
      tagId = res.body;
      expect(res.statusCode).toEqual(201);

      // post tag2
      request(app)
      .post('/api/tags')
      .send(tagMockData.valid2)
      .end(function (err, res) {
      expect(res.statusCode).toEqual(201);

        // retrieve only tag1
        request(app)
        .get('/api/tags/' + tagId)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body._id).toEqual(tagId);
          expect(res.statusCode).toEqual(200);
          done();
        });
      });
    });
  });

  it('should FAIL to GET with an invalid tagId', function (done) {
    var tagId = '/api/tags/' + '123456789';
    request(app)
    .post('/api/tags')
    .send(tagMockData.valid)
    .end(function (err, res) {
      expect(res.statusCode).toEqual(201);

      request(app)
      .get(tagId)
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

  it('should update (via PUT) and populate tagId an existing tagId', function (done) {
    // create tag
    var tagId;
    request(app)
    .post('/api/tags')
    .send(tagMockData.valid4)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.statusCode).toEqual(201);
      tagId = res.body;

      // update tag
      request(app)
      .put('/api/tags/' + tagId)
      .send({
        name: 'Node',
      })
      .end(function (err, res2) {
        if (err) return done(err);
        expect(res2.statusCode).toEqual(201);
        done();
        });
      });
  });

});

