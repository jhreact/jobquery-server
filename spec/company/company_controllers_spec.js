'use strict';

var companyCtrl = require('../../server/company/company_controllers.js');

describe('company controller', function () {

  it('should have a get method', function () {
    expect(companyCtrl.get).toEqual(jasmine.any(Function));
  });

  it('should have a post method', function () {
    expect(companyCtrl.post).toEqual(jasmine.any(Function));
  });

});
