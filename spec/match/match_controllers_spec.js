'use strict';

var matchCtrl = require('../../server/match/match_controllers.js');

describe('match controller', function () {

  it('should have a get method', function () {
    expect(matchCtrl.get).toEqual(jasmine.any(Function));
  });

  it('should have a post method', function () {
    expect(matchCtrl.post).toEqual(jasmine.any(Function));
  });

  it('should have a getByUserId method', function () {
    expect(matchCtrl.getByUserId).toEqual(jasmine.any(Function));
  });

  it('should have a getByOppId method', function () {
    expect(matchCtrl.getByOppId).toEqual(jasmine.any(Function));
  });

  it('should have a putByIds method', function () {
    expect(matchCtrl.putByIds).toEqual(jasmine.any(Function));
  });

});
