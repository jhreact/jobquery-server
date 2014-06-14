'use strict';

var matchCtrl = require('../../server/match/match_controllers.js');

describe('match controller', function () {

  it('should have a get method', function () {
    expect(matchCtrl.get).toEqual(jasmine.any(Function));
  });

  it('should have a getByUserId method', function () {
    expect(matchCtrl.getByUserId).toEqual(jasmine.any(Function));
  });

  it('should have a putByUserId method', function () {
    expect(matchCtrl.putByUserId).toEqual(jasmine.any(Function));
  });

  it('should have a getByOppId method', function () {
    expect(matchCtrl.getByOppId).toEqual(jasmine.any(Function));
  });

  it('should have a putByOppId method', function () {
    expect(matchCtrl.putByOppId).toEqual(jasmine.any(Function));
  });

});
