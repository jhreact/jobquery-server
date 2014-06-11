'use strict';

var userCtrl = require('../../server/user/user_controllers.js');

describe('user controller', function () {

  it('should have a get method', function () {
    expect(userCtrl.get).toEqual(jasmine.any(Function));
  });

  it('should have a post method', function () {
    expect(userCtrl.post).toEqual(jasmine.any(Function));
  });

});
