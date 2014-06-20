var mongoose = require('mongoose');
var conn = mongoose.connection;

conn.on('error', function (err) {
  console.log('connection error:', err);
});

var Tag = require('../../server/tag/tag_model.js');
var tagMockData = require('./tag_model_mockData.js');

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

describe('Tag Model', function () {

  beforeEach(function (done) {
    checkState(done);
  });

  it('should be able to create new document', function (done) {

    Tag.create(tagMockData.valid, function (err, newTag) {
      expect(err).toBeNull();
      expect(newTag).toBeDefined();
      expect(newTag.name).toEqual(tagMockData.valid.name);
      expect(newTag.label).toEqual(tagMockData.valid.label);
      expect(newTag.isPublic).toEqual(true);
      done();
    });
  });

  it('should fail to create when name is not unique', function (done) {
    Tag.create(tagMockData.valid, function (err, firstTag) {
      Tag.create(tagMockData.valid, function (err, newTag) {
        expect(err).toBeDefined();
        expect(err.code).toEqual(11000); // duplicate error code is 11000
        expect(newTag).toBeUndefined();
        done();
      });
    });
  });

  it('should fail to create when missing name', function (done) {
    Tag.create(tagMockData.missing.name, function (err, newTag) {
      expect(err).toBeDefined();
      expect(err.errors.name.type).toEqual('required');
      expect(newTag).toBeUndefined();
      done();
    });
  });

  it('should fail to create when missing label', function (done) {
    Tag.create(tagMockData.missing.label, function (err, newTag) {
      expect(err).toBeDefined();
      expect(err.errors.label.type).toEqual('required');
      expect(newTag).toBeUndefined();
      done();
    });
  });

  it('should cast to specified type for name', function (done) {
    Tag.create(tagMockData.invalid.name, function (err, newTag) {
      expect(err).toBeNull();
      expect(newTag).toBeDefined();
      done();
    });
  });

  it('should cast to specified type for isPublic', function (done) {
    Tag.create(tagMockData.invalid.isPublic, function (err, newTag) {
      expect(err).toBeNull();
      expect(newTag).toBeDefined();
      done();
    });
  });

  it('should cast to specified type for scaleDescription', function (done) {
    Tag.create(tagMockData.mixedScale, function (err, newTag) {
      expect(err).toBeNull();
      expect(newTag).toBeDefined();
      done();
    });
  });

  it('should have new updatedAt property on update', function (done) {
    Tag.create(tagMockData.valid, function (err, newTag) {
      expect(err).toBeNull();
      expect(newTag).toBeDefined();
      newTag.name = 'someName';
      var originalTime = newTag.updatedAt;
      newTag.save(function (err, savedTag) {
        expect(err).toBeNull();
        expect(savedTag).toBeDefined();
        expect(savedTag.name).toEqual('someName');
        expect(savedTag.updatedAt.getTime()).toBeGreaterThan(originalTime);
        done();
      });
    });
  });

  it('should be able to create multiple tags at once', function (done) {
    // put tag objects in an array
    Tag.create([tagMockData.valid, tagMockData.valid2], function (err) {
      var tags = Array.prototype.slice.call(arguments, 1);
      expect(tags.length).toEqual(2);
      done();
    });
  });

});

