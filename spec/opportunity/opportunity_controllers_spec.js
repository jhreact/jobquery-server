'use strict';

var oppCtrl = require('../../server/opportunity/opportunity_controllers.js');

describe('opportunity controller', function () {

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
