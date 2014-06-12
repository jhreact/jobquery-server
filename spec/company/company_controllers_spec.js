'use strict';

var companyCtrl = require('../../server/company/company_controllers.js');

describe('company controller', function () {

  it('should have a get method', function () {
    expect(companyCtrl.get).toEqual(jasmine.any(Function));
  });

  it('should have a post method', function () {
    expect(companyCtrl.post).toEqual(jasmine.any(Function));
  });

  it('should have a getById method', function () {
    expect(companyCtrl.getById).toEqual(jasmine.any(Function));
  });

  it('should have a postById method', function () {
    expect(companyCtrl.putById).toEqual(jasmine.any(Function));
  });

});
